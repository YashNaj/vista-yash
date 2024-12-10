import prisma from "$lib/prisma";
import { superValidate } from "sveltekit-superforms";
import { createUserSchema } from "$lib/schemas/user";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { createUser } from "$lib/db";
import { json } from "@sveltejs/kit";

export const load = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });

  const users = await prisma.user.findMany();

  return { posts, users, addForm: await superValidate(zod(createUserSchema)) };
};

export const actions: Actions = {
  addUser: async (event) => {
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
  deleteUsers: async ({ request }) => {
    const formData = await request.formData();
    const ids = formData.get("ids")?.toString().split(",").map(Number);
    console.log(ids);
    if (!ids || !ids.length) {
      return fail(400, {
        success: false,
        message: "No users selected",
      });
    }

    try {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return { success: true };
    } catch (error) {
      return fail(500, {
        success: false,
        message: "Failed to delete users",
      });
    }
  },
};
