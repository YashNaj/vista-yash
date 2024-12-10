// @ts-nocheck
import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms";
import { createUserSchema } from "$lib/schemas/user";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { createUser } from "$lib/db";

export const load = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });

  const users = await prisma.user.findMany();

  return { posts, users, addForm: await superValidate(zod(createUserSchema)) };
};

export const actions = {
  addUser: async (event: import('./$types').RequestEvent) => {
    const addForm = await superValidate(event, zod(createUserSchema));

    if (!addForm.valid) {
      return fail(400, {
        addForm,
      });
    }
    const [user, userError] = await createUser({
      email: addForm.data.email,
      name: addForm.data.name,
    });

    if (!user) {
      // If creation fails, set form error and return
      addForm.errors.email = ["Email already exists"];
      return fail(400, { addForm });
    }

    if (userError) {
      return fail(400, {
        addForm,
      });
    }

    return {
      addForm,
    };
  },
};
;null as any as Actions;