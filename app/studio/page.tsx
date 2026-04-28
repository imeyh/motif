import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCollection } from "./actions";

type StudioPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

function getStudioMessage(message?: string) {
  switch (message) {
    case "collection-deleted":
      return "컬렉션이 삭제되었습니다.";
    case "delete-blocked":
      return "처리 중인 주문이 있는 컬렉션은 삭제할 수 없습니다.";
    default:
      return null;
  }
}

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const { message } = await searchParams;
  const studioMessage = getStudioMessage(message);

  const collections = await prisma.collection.findMany({
    where: {
      deletedAt: null,
    },
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
            취향의 조각을 모아 컬렉션으로 남기는 작업실
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
            새 컬렉션 시작하기
          </Link>
        </div>
      </header>

      {studioMessage && (
        <div className="mx-auto mb-6 max-w-5xl border border-neutral-300 bg-white/70 px-4 py-3 text-sm text-neutral-700">
          {studioMessage}
        </div>
      )}

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
            {collections.map((collection) => {
              const hasActiveOrder = collection.orders.some(
                (order) =>
                  order.status === "PENDING" || order.status === "PROCESSING",
              );

              return (
                <article
                  key={collection.id}
                  className="border border-neutral-300 bg-white/60 p-5"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="mb-2 flex min-w-0 items-center gap-3">
                        <h2 className="truncate text-lg font-medium">
                          {collection.title}
                        </h2>
                        <span className="shrink-0 text-xs tracking-[0.16em] text-neutral-500">
                          {collection.visibility}
                        </span>
                      </div>

                      <p className="whitespace-nowrap text-sm text-neutral-500">
                        {collection.items.length} items ·{" "}
                        {collection.orders.length} orders
                      </p>

                      {collection.intro && (
                        <p className="mt-3 line-clamp-1 text-sm text-neutral-600">
                          {collection.intro}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="whitespace-nowrap border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                      >
                        상세 보기
                      </Link>

                      <Link
                        href={`/studio/collections/${collection.id}/order`}
                        className="whitespace-nowrap border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                      >
                        주문
                      </Link>

                      <Link
                        href={`/studio/collections/${collection.id}/edit`}
                        className="whitespace-nowrap border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
                      >
                        수정
                      </Link>

                      {hasActiveOrder ? (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed whitespace-nowrap border border-neutral-200 px-4 py-2 text-sm text-neutral-300"
                        >
                          삭제 불가
                        </button>
                      ) : (
                        <form action={deleteCollection}>
                          <input
                            type="hidden"
                            name="collectionId"
                            value={collection.id}
                          />
                          <button className="whitespace-nowrap border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            삭제
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {hasActiveOrder && (
                    <p className="mt-3 text-right text-xs text-neutral-400">
                      처리 중인 주문이 있어 삭제할 수 없습니다.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}