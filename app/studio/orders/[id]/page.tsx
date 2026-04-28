import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "./actions";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderSnapshot = {
  template?: string;
  title: string;
  intro?: string | null;
  outro?: string | null;
  orderedAt?: string;
  items: {
    id: string;
    type: string;
    title: string;
    note: string;
    imageUrl?: string | null;
    sourceUrl?: string | null;
    position: number;
  }[];
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.bookOrder.findUnique({
    where: { id },
    include: {
      collection: true,
    },
  });

  if (!order) {
    notFound();
  }

  const snapshot = JSON.parse(order.snapshotJson) as OrderSnapshot;

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <div>
          <Link
            href="/studio"
            className="text-sm text-neutral-500 hover:text-black"
          >
            ← Studio
          </Link>

          <h1 className="mt-4 text-3xl font-semibold">주문 상세</h1>
          <p className="mt-2 text-sm text-neutral-500">
            주문 시점에 확정된 컬렉션 내용을 확인합니다.
          </p>
        </div>

        <Link
          href="/studio/orders"
          className="border border-neutral-300 bg-white/70 px-4 py-2 text-sm hover:bg-white"
        >
          주문 목록
        </Link>
      </header>

      <section className="mx-auto max-w-3xl space-y-6">
        <div className="border border-neutral-300 bg-white/70 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm tracking-[0.18em] text-neutral-500">
                ORDER
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{snapshot.title}</h2>
            </div>

            <span className="whitespace-nowrap text-sm tracking-[0.16em] text-neutral-500">
              {order.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-neutral-600">
            <p>Template: {snapshot.template ?? "ESSAY"}</p>
            <p>Items: {snapshot.items.length}</p>
            <p>Created: {order.createdAt.toLocaleString("ko-KR")}</p>
          </div>

          {order.requesterNote && (
            <p className="mt-5 border-t border-neutral-300 pt-5 text-sm leading-6 text-neutral-700">
              요청 메모: {order.requesterNote}
            </p>
          )}
        </div>

        <div className="border border-neutral-300 bg-white/70 p-6">
          <p className="mb-2 text-sm tracking-[0.18em] text-neutral-500">
            주문 처리 상태 관리
          </p>

          <p className="mb-4 text-sm text-neutral-500">
            데모 환경에서는 Studio에서 주문 처리 상태를 직접 변경합니다.
          </p>

          <div className="flex flex-wrap gap-2">
            {order.status === "PENDING" && (
              <>
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="nextStatus" value="PROCESSING" />
                  <button className="bg-neutral-900 px-4 py-2 text-sm text-white">
                    처리 시작
                  </button>
                </form>

                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="nextStatus" value="CANCELED" />
                  <button className="border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
                    주문 취소
                  </button>
                </form>
              </>
            )}

            {order.status === "PROCESSING" && (
              <>
                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="nextStatus" value="COMPLETED" />
                  <button className="bg-neutral-900 px-4 py-2 text-sm text-white">
                    완료 처리
                  </button>
                </form>

                <form action={updateOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="nextStatus" value="CANCELED" />
                  <button className="border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
                    주문 취소
                  </button>
                </form>
              </>
            )}

            {(order.status === "COMPLETED" || order.status === "CANCELED") && (
              <p className="text-sm text-neutral-500">
                이 주문은 더 이상 상태를 변경할 수 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="border border-neutral-300 bg-white/70 p-6">
          <p className="mb-4 text-sm tracking-[0.18em] text-neutral-500">
            SNAPSHOT ITEMS
          </p>

          <div className="space-y-5">
            {snapshot.items.map((item) => (
              <div
                key={item.id}
                className="border-t border-neutral-300 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-sm tracking-[0.14em] text-neutral-500">
                  {item.type} | #{item.position}
                </p>
                <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
