import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createBookOrder } from "./actions";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  const canOrder = collection.items.length > 0;

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-10 max-w-3xl">
        <Link
          href={`/studio/collections/${collection.id}/edit`}
          className="text-sm text-neutral-500 hover:text-black"
        >
          ← 컬렉션 편집으로
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">책 주문 생성</h1>
        <p className="mt-2 text-sm text-neutral-500">
          완성한 컬렉션을 책으로 남기기 위한 주문 기록을 만듭니다.
        </p>
      </header>

      <section className="mx-auto max-w-3xl border border-neutral-300 bg-white/70 p-6">
        <div className="border-b border-neutral-300 pb-6">
          <p className="text-sm tracking-[0.18em] text-neutral-500">
            ORDER TARGET
          </p>

          <h2 className="mt-3 text-2xl font-semibold">{collection.title}</h2>

          {collection.intro && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
              {collection.intro}
            </p>
          )}

          <p className="mt-4 text-sm text-neutral-500">
            {collection.items.length}개의 아이템 포함
          </p>
        </div>

        {!canOrder ? (
          <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            아이템이 없는 컬렉션은 주문할 수 없습니다. 먼저 아이템을 추가해 주세요.
          </div>
        ) : (
          <form action={createBookOrder} className="mt-6 space-y-6">
            <input type="hidden" name="collectionId" value={collection.id} />

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                책 템플릿
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="cursor-pointer border border-neutral-300 bg-white px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="template"
                    value="ESSAY"
                    defaultChecked
                    className="mr-2 accent-neutral-900"
                  />
                  ESSAY
                </label>

                <label className="cursor-pointer border border-neutral-300 bg-white px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="template"
                    value="LIST"
                    className="mr-2 accent-neutral-900"
                  />
                  LIST
                </label>

                <label className="cursor-pointer border border-neutral-300 bg-white px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="template"
                    value="VISUAL"
                    className="mr-2 accent-neutral-900"
                  />
                  VISUAL
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                요청 메모
              </label>
              <textarea
                name="requesterNote"
                rows={4}
                placeholder="예: 글의 흐름이 잘 보이도록 구성해주세요."
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 px-5 py-3 text-sm text-white hover:bg-neutral-700"
            >
              주문 생성하기
            </button>
          </form>
        )}
      </section>
    </main>
  );
}