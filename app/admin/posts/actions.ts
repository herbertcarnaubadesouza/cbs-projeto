"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToFirebase } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value.length > 0 ? value : null;
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getPublished(formData: FormData) {
  return formData.get("published") === "on";
}

async function ensureUniqueSlug(slug: string, currentId?: number) {
  const existingPost = await prisma.post.findUnique({
    where: { slug },
  });

  if (existingPost && existingPost.id !== currentId) {
    throw new Error("Ja existe um post com esse slug.");
  }
}

async function parsePostInput(formData: FormData) {
  const title = getString(formData, "title");
  const rawSlug = getString(formData, "slug");
  const slug = normalizeSlug(rawSlug || title);
  const excerpt = getOptionalString(formData, "excerpt");
  const currentCoverImage = getOptionalString(formData, "currentCoverImage");
  const removeCoverImage = formData.get("removeCoverImage") === "on";
  const coverImageFile = getFile(formData, "coverImageFile");
  const content = getString(formData, "content");
  const published = getPublished(formData);

  if (title.length < 3) {
    throw new Error("O titulo precisa ter pelo menos 3 caracteres.");
  }

  if (slug.length < 3) {
    throw new Error("O slug precisa ter pelo menos 3 caracteres.");
  }

  if (content.length < 20) {
    throw new Error("O conteudo precisa ter pelo menos 20 caracteres.");
  }

  let coverImage = removeCoverImage ? null : currentCoverImage;

  if (coverImageFile) {
    coverImage = await uploadImageToFirebase(coverImageFile, slug);
  }

  return {
    title,
    slug,
    excerpt,
    coverImage,
    content,
    published,
  };
}

function revalidateBlog() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts/new");
}

export async function createPost(formData: FormData) {
  const data = await parsePostInput(formData);

  await ensureUniqueSlug(data.slug);

  const post = await prisma.post.create({ data });

  revalidateBlog();
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath(`/admin/posts/${post.id}/edit`);

  redirect("/admin");
}

export async function updatePost(formData: FormData) {
  const idValue = getString(formData, "id");
  const id = Number(idValue);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Post invalido.");
  }

  const data = await parsePostInput(formData);
  const currentPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!currentPost) {
    throw new Error("Post nao encontrado.");
  }

  await ensureUniqueSlug(data.slug, id);

  const updatedPost = await prisma.post.update({
    where: { id },
    data,
  });

  revalidateBlog();
  revalidatePath(`/blog/${currentPost.slug}`);
  revalidatePath(`/blog/${updatedPost.slug}`);
  revalidatePath(`/admin/posts/${id}/edit`);

  redirect("/admin");
}

export async function deletePost(formData: FormData) {
  const idValue = getString(formData, "id");
  const id = Number(idValue);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Post invalido.");
  }

  const currentPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!currentPost) {
    throw new Error("Post nao encontrado.");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidateBlog();
  revalidatePath(`/blog/${currentPost.slug}`);

  redirect("/admin");
}
