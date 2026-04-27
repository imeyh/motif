"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ItemTypeValue = "BOOK" | "MUSIC" | "PLACE" | "LINK" | "FOOD" | "OTHER";

function normalizeItemType(type: string): ItemTypeValue {
  if (type === "BOOK") return "BOOK";
  if (type === "MUSIC") return "MUSIC";
  if (type === "PLACE") return "PLACE";
  if (type === "LINK") return "LINK";
  if (type === "FOOD") return "FOOD";
  return "OTHER";
}

function editPath(collectionId: string, saved: string) {
  return `/studio/collections/${collectionId}/edit?saved=${saved}`;
}

export async function updateCollection(formData: FormData) {
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const coverImageUrl = String(formData.get("coverImageUrl") || "");
  const intro = String(formData.get("intro") || "");
  const outro = String(formData.get("outro") || "");
  const visibility = String(formData.get("visibility") || "DRAFT");

  if (!id || !title) return;

  await prisma.collection.update({
    where: { id },
    data: {
      title,
      coverImageUrl: coverImageUrl || null,
      intro,
      outro,
      visibility: visibility === "PUBLIC" ? "PUBLIC" : "DRAFT",
    },
  });

  revalidatePath(`/studio/collections/${id}/edit`);
  revalidatePath("/");
  redirect(editPath(id, "collection"));
}

export async function addItem(formData: FormData) {
  const collectionId = String(formData.get("collectionId") || "");
  const type = normalizeItemType(String(formData.get("type") || "OTHER"));
  const title = String(formData.get("title") || "");
  const note = String(formData.get("note") || "");
  const imageUrl = String(formData.get("imageUrl") || "");
  const sourceUrl = String(formData.get("sourceUrl") || "");

  if (!collectionId || !title || !note) return;

  const lastItem = await prisma.item.findFirst({
    where: { collectionId },
    orderBy: { position: "desc" },
  });

  await prisma.item.create({
    data: {
      collectionId,
      type,
      title,
      note,
      imageUrl: imageUrl || null,
      sourceUrl: sourceUrl || null,
      position: lastItem ? lastItem.position + 1 : 1,
    },
  });

  revalidatePath(`/studio/collections/${collectionId}/edit`);
  redirect(editPath(collectionId, "item-added"));
}

export async function updateItem(formData: FormData) {
  const collectionId = String(formData.get("collectionId") || "");
  const itemId = String(formData.get("itemId") || "");
  const type = normalizeItemType(String(formData.get("type") || "OTHER"));
  const title = String(formData.get("title") || "");
  const note = String(formData.get("note") || "");
  const imageUrl = String(formData.get("imageUrl") || "");
  const sourceUrl = String(formData.get("sourceUrl") || "");

  if (!collectionId || !itemId || !title || !note) return;

  await prisma.item.update({
    where: { id: itemId },
    data: {
      type,
      title,
      note,
      imageUrl: imageUrl || null,
      sourceUrl: sourceUrl || null,
    },
  });

  revalidatePath(`/studio/collections/${collectionId}/edit`);
  redirect(editPath(collectionId, "item-updated"));
}

export async function deleteItem(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const collectionId = String(formData.get("collectionId") || "");

  if (!itemId || !collectionId) return;

  await prisma.item.delete({
    where: { id: itemId },
  });

  revalidatePath(`/studio/collections/${collectionId}/edit`);
  redirect(editPath(collectionId, "item-deleted"));
}

export async function moveItem(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const collectionId = String(formData.get("collectionId") || "");
  const direction = String(formData.get("direction") || "");

  if (!itemId || !collectionId) return;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) return;

  const target = await prisma.item.findFirst({
    where: {
      collectionId,
      position:
        direction === "up"
          ? { lt: item.position }
          : { gt: item.position },
    },
    orderBy: {
      position: direction === "up" ? "desc" : "asc",
    },
  });

  if (!target) return;

  await prisma.$transaction([
    prisma.item.update({
      where: { id: item.id },
      data: { position: target.position },
    }),
    prisma.item.update({
      where: { id: target.id },
      data: { position: item.position },
    }),
  ]);

  revalidatePath(`/studio/collections/${collectionId}/edit`);
  redirect(editPath(collectionId, "item-moved"));
}