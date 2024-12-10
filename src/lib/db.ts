import prisma from "$lib/prisma";
import type { Post, User } from "@prisma/client";

//NOTE: This is a pattern I learned last year from fire ship, it's my favorite.
//      I would usually use tanstack but I am trying to keep this application as simple
//      as possilbe while showcasing polish.

//TYPE: The result type, for use in form actions.
type Result<T> = [T, null] | [null, Error];

// User Operations
export async function createUser(data: {
  email: string;
  name?: string;
}): Promise<Result<User>> {
  try {
    const user = await prisma.user.create({ data });
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getAllUsers(
  includePost = false,
): Promise<Result<User[]>> {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: includePost,
      },
    });
    return [users, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getUserById(
  id: number,
  includePost = false,
): Promise<Result<User | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: includePost,
      },
    });
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getUserByEmail(
  email: string,
): Promise<Result<User | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function updateUser(
  id: number,
  data: { email?: string; name?: string },
): Promise<Result<User>> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function deleteUser(id: number): Promise<Result<User>> {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

// Post Operations
export async function createPost(data: {
  title: string;
  content?: string;
  published?: boolean;
  authorId?: number;
}): Promise<Result<Post>> {
  try {
    const post = await prisma.post.create({
      data,
    });
    return [post, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getAllPosts(
  includeAuthor = false,
): Promise<Result<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: includeAuthor,
      },
    });
    return [posts, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getPublishedPosts(
  includeAuthor = false,
): Promise<Result<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: includeAuthor,
      },
    });
    return [posts, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getPostById(
  id: number,
  includeAuthor = false,
): Promise<Result<Post | null>> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: includeAuthor,
      },
    });
    return [post, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function updatePost(
  id: number,
  data: {
    title?: string;
    content?: string;
    published?: boolean;
    authorId?: number;
  },
): Promise<Result<Post>> {
  try {
    const post = await prisma.post.update({
      where: { id },
      data,
    });
    return [post, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function deletePost(id: number): Promise<Result<Post>> {
  try {
    const post = await prisma.post.delete({
      where: { id },
    });
    return [post, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function searchPosts(
  searchString: string,
): Promise<Result<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      },
      include: {
        author: true,
      },
    });
    return [posts, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}

export async function getPostsByAuthorId(
  authorId: number,
): Promise<Result<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId },
      include: {
        author: true,
      },
    });
    return [posts, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}
