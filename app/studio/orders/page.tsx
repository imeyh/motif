import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OrderSnapshot = {
  title?: string;
  template?: string;
  items?: unknown[];
};

export default async function OrdersPage() {
  const orders = await prisma.bookOrder.findMany({
    include: {
      collection: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <div>
          <Link href="/studio" className="text-sm text-neutral-500 hover:text-black">
            ← Studio
          </Link>

          <h1 className="mt-4 text-3xl font-semibold">주문 목록</h1>
          <p className="mt-2 text-sm text-neutral-500">
            컬렉션을 책으로 만들기 위해 생성된 주문을 관리합니다.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl">
        {orders.length === 0 ? (
          <div className="border border-neutral-300 bg-white/70 p-10 text-center text-sm text-neutral-500">
            아직 생성된 주문이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const snapshot = JSON.parse(order.snapshotJson) as OrderSnapshot;

              return (
                <article
                  key={order.id}
                  className="flex items-center justify-between border border-neutral-300 bg-white/70 p-5"
                >
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="text-lg font-medium">
                        {snapshot.title ?? order.collection.title}
                      </h2>
                      <span className="text-xs tracking-[0.16em] text-neutral-500">
                        {order.status}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-500">
                      {snapshot.template ?? "ESSAY"} ·{" "}
                      {snapshot.items?.length ?? 0} items ·{" "}
                      {order.createdAt.toLocaleString("ko-KR")}
                    </p>
                  </div>

                  <Link
                    href={`/studio/orders/${order.id}`}
                    className="border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                  >
                    상세 보기
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}