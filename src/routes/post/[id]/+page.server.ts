import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const load = async ({ params }) => {
  let id = parseInt(params.id);
  try {
    const post = await prisma.post.findUnique({
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

    console.log(post);
    return {
      post,
    };
  } catch (e) {
    console.error("Error fetching post:", e);
    throw error(500, "Error fetching post");
  }
};
