// 주문 상태 거꾸로 가는 것 ㄴㄴㄴㄴ

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type OrderStatusValue = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELED";

const allowedTransitions: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["PROCESSING", "CANCELED"],
  PROCESSING: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: [],
};

function isOrderStatus(value: string): value is OrderStatusValue {
  return ["PENDING", "PROCESSING", "COMPLETED", "CANCELED"].includes(value);
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const nextStatus = String(formData.get("nextStatus") || "");

  if (!orderId || !isOrderStatus(nextStatus)) return;

  const order = await prisma.bookOrder.findUnique({
    where: { id: orderId },
  });

  if (!order) return;

  const currentStatus = order.status as OrderStatusValue;

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    return;
  }

  await prisma.bookOrder.update({
    where: { id: orderId },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath(`/studio/orders/${orderId}`);
  revalidatePath("/studio/orders");
  revalidatePath("/studio");
}