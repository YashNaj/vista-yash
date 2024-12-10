// @ts-nocheck
import { error, fail, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { updatePostSchema } from "$lib/schemas/post";
import { zod } from "sveltekit-superforms/adapters";
import { getPostById, updatePost } from "$lib/db";

export const load = async ({ params }) => {
  let id = parseInt(params.id);
  const [post, postError] = await getPostById(id, true);

  if (postError) {
    console.error("Error fetching post:", postError);
    throw error(500, "Error fetching post");
  }

  console.log(post);
  return {
    post,
    updateForm: await superValidate(zod(updatePostSchema)),
  };
};

export const actions = {
  edit: async (event: import('./$types').RequestEvent) => {
    console.log("reaching action");
    const updateForm = await superValidate(event, zod(updatePostSchema));
    const id = parseInt(event.params.id);
    console.log(updateForm);
    if (!updateForm.valid) {
      return fail(400, {
        updateForm,
      });
    }
    const [update, updateError] = await updatePost(id, {
      title: updateForm.data.title,
      content: updateForm.data.content,
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
};
;null as any as Actions;