"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function studioPath(message: string) {
  return `/studio?message=${message}`;
}

export async function deleteCollection(formData: FormData) {
  const collectionId = String(formData.get("collectionId") || "");

  if (!collectionId) return;

  const activeOrder = await prisma.bookOrder.findFirst({
    where: {
      collectionId,
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
  });

  if (activeOrder) {
    redirect(studioPath("delete-blocked"));
  }

  // 실제 db에는 삭제 ㄴㄴ
  await prisma.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      deletedAt: new Date(),
      visibility: "DRAFT",
    },
  });

  revalidatePath("/");
  revalidatePath("/studio");

  redirect(studioPath("collection-deleted"));
}