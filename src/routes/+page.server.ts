import prisma from "$lib/prisma";

export const load = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });

  const users = await prisma.user.findMany();

  return { posts, users };
};

export const actions = {
  default: async ({ }) => { },
};
