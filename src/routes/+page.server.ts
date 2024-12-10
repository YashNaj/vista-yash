import prisma from "$lib/prisma";

export const load = async () => {
  const data = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });

  return { feed: data };
};
