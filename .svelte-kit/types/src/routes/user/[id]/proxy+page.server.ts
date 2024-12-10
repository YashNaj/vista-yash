// @ts-nocheck
import { error, fail, type Actions } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { createPost, updateUser } from "$lib/db";
import { updateUserSchema } from "$lib/schemas/user";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createPostSchema } from "$lib/schemas/post";
import { create } from "node:domain";

export const load = async ({ params }) => {
  let id = parseInt(params.id);

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw error(404, "Post not found");
    }
    return {
      updateForm: await superValidate(zod(updateUserSchema)),
      createPostForm: await superValidate(zod(createPostSchema)),
      user,
    };
  } catch (e) {
    console.error("Error fetching post:", e);
    throw error(500, "Error fetching post");
  }
};

export const actions = {
  edit: async (event: import('./$types').RequestEvent) => {
    console.log("reaching action");
    const updateForm = await superValidate(event, zod(updateUserSchema));
    const id = parseInt(event.params.id);
    console.log(updateForm);
    if (!updateForm.valid) {
      return fail(400, {
        updateForm,
      });
    }
    const [update, updateError] = await updateUser(id, {
      ...updateForm.data,
    });

    if (!update) {
      // If creation fails, set form error and return
      return fail(400, { updateForm });
    }

    if (updateError) {
      console.log(updateError);
      return fail(400, {
        updateForm,
      });
    }

    return {
      updateForm,
    };
  },
  addPost: async (event: import('./$types').RequestEvent) => {
    console.log("reaching action");
    const createPostForm = await superValidate(event, zod(createPostSchema));
    const id = parseInt(event.params.id);
    createPostForm.data.authorId = id;
    console.log(createPostForm);
    if (!createPostForm.valid) {
      return fail(400, {
        createPostForm,
      });
    }
    const [post, postError] = await createPost({
      title: createPostForm.data.title,
      content: createPostForm.data.content,
      authorId: id,
    });

    if (!post) {
      // If creation fails, set form error and return
      return fail(400, { createPostForm });
    }

    if (postError) {
      console.log(postError);
      return fail(400, {
        createPostForm,
      });
    }

    return {
      createPostForm,
    };
  },
  delete: async (event: import('./$types').RequestEvent) => { },
};
;null as any as Actions;