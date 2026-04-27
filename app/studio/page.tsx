import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function StudioPage() {
  const collections = await prisma.collection.findMany({
    include: {
      items: true,
      orders: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-12 flex max-w-5xl items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-neutral-500 hover:text-black">
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-wide">Studio</h1>
          <p className="mt-2 text-sm text-neutral-500">
            내가 만든 컬렉션을 관리하는 작업 공간
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/studio/orders"
            className="rounded-full border border-neutral-300 bg-white/70 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-white"
          >
            주문 목록
          </Link>

          <Link
            href="/studio/collections/new"
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700"
          >
            새 컬렉션 만들기
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl">
        {collections.length === 0 ? (
          <div className="border border-neutral-300 bg-white/60 p-10 text-center">
            <p className="text-neutral-600">아직 만든 컬렉션이 없습니다.</p>
            <Link
              href="/studio/collections/new"
              className="mt-5 inline-block underline underline-offset-4"
            >
              첫 컬렉션 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection) => (
              <article
                key={collection.id}
                className="flex items-center justify-between border border-neutral-300 bg-white/60 p-5"
              >
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-lg font-medium">{collection.title}</h2>
                    <span className="text-xs tracking-[0.16em] text-neutral-500">
                      {collection.visibility}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500">
                    {collection.items.length} items · {collection.orders.length}{" "}
                    orders
                  </p>

                  {collection.intro && (
                    <p className="mt-3 line-clamp-1 text-sm text-neutral-600">
                      {collection.intro}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                  >
                    상세 보기
                  </Link>

                  <Link
                    href={`/studio/collections/${collection.id}/edit`}
                    className="border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                  >
                    수정
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
