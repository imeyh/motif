"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function createSlug() {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `collection-${suffix}`;
}

export async function createCollection(formData: FormData) {
    const title = String(formData.get("title") || "");
    const intro = String(formData.get("intro") || "");
    const outro = String(formData.get("outro") || "");

    if (!title) return;

    const slug = createSlug();

    // 지금은 auth 없음 → demo user 1명 기준
    const user = await prisma.user.findFirst();

    const collection = await prisma.collection.create({
        data: {
            ownerId: user!.id,
            title,
            slug,
            intro,
            outro,
            visibility: "DRAFT",
        },
    });

    redirect(`/studio/collections/${collection.id}/edit`);
}