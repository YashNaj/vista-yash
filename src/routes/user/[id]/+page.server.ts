import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load = async ({ params }) => {
  let id = parseInt(params.id);
  try {
    const user = await prisma.user.findUnique({
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

    console.log(user);
    return {
      user,
    };
  } catch (e) {
    console.error("Error fetching post:", e);
    throw error(500, "Error fetching post");
  }
};
