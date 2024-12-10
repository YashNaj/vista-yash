// @ts-nocheck
import { error, fail, type Actions } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms";
import { updatePostSchema } from "$lib/schemas/post";
import { zod } from "sveltekit-superforms/adapters";
import { updatePost } from "$lib/db";

export const load = async ({ params }) => {
  let id = parseInt(params.id);
  let post;
  try {
    post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw error(404, "Post not found");
    }
    const updateForm = superValidate(post, zod(updatePostSchema));

    console.log(post);
    return {
      post,
      updateForm,
    };
  } catch (e) {
    console.error("Error fetching post:", e);
    throw error(500, "Error fetching post");
  }
};

export const actions = {
  update: async (event: import('./$types').RequestEvent) => {
    const updateForm = await superValidate(event, zod(updatePostSchema));
    const id = parseInt(updateForm.data.id);
    if (!updateForm.valid) {
      return fail(400, {
        updateForm,
      });
    }
    const [update, updateError] = await updatePost({
      title: updateForm.data.title,
      content: updateForm.data.content,
    });

    if (!update) {
      // If creation fails, set form error and return
      return fail(400, { updateForm });
    }

    if (updateError) {
      return fail(400, {
        updateForm,
      });
    }

    return {
      updateForm,
    };
  },
};
;null as any as Actions;