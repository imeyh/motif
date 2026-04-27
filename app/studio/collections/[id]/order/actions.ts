"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function normalizeTemplate(template: string) {
  if (template === "LIST") return "LIST";
  if (template === "VISUAL") return "VISUAL";
  return "ESSAY";
}

export async function createBookOrder(formData: FormData) {
  const collectionId = String(formData.get("collectionId") || "");
  const template = normalizeTemplate(String(formData.get("template") || "ESSAY"));
  const requesterNote = String(formData.get("requesterNote") || "");

  if (!collectionId) return;

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!collection) return;

  if (collection.items.length === 0) {
    throw new Error("아이템이 없는 컬렉션은 주문할 수 없습니다.");
  }

  const snapshot = {
    template,
    collectionId: collection.id,
    title: collection.title,
    slug: collection.slug,
    coverImageUrl: collection.coverImageUrl,
    intro: collection.intro,
    outro: collection.outro,
    items: collection.items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      note: item.note,
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
      position: item.position,
    })),
    orderedAt: new Date().toISOString(),
  };

  const order = await prisma.bookOrder.create({
    data: {
      collectionId: collection.id,
      requesterNote: requesterNote || null,
      status: "PENDING",
      snapshotJson: JSON.stringify(snapshot),
    },
  });

  redirect(`/studio/orders/${order.id}`);
}