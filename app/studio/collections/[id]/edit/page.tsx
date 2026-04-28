import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import {
  addItem,
  deleteItem,
  moveItem,
  updateCollection,
  updateItem,
} from "./actions";

type EditCollectionPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
  }>;
};

function getSavedMessage(saved?: string) {
  switch (saved) {
    case "collection":
      return "컬렉션 정보가 저장되었습니다.";
    case "item-added":
      return "아이템이 추가되었습니다.";
    case "item-updated":
      return "아이템이 수정되었습니다.";
    case "item-deleted":
      return "아이템이 삭제되었습니다.";
    case "item-moved":
      return "아이템 순서가 변경되었습니다.";
    default:
      return null;
  }
}

export default async function EditCollectionPage({
  params,
  searchParams,
}: EditCollectionPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const savedMessage = getSavedMessage(saved);

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

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <div>
          <Link
            href="/studio"
            className="text-sm text-neutral-500 hover:text-black"
          >
            ← Studio
          </Link>
          <h1 className="mt-4 text-3xl font-semibold">컬렉션 편집</h1>
          <p className="mt-2 text-sm text-neutral-500">
            컬렉션의 소개와 아이템을 정리하세요
          </p>
        </div>

        <Link
          href={`/collections/${collection.slug}`}
          className="border border-neutral-300 bg-white/70 px-4 py-2 text-sm hover:bg-white"
        >
          상세 보기
        </Link>
      </header>

      {savedMessage && (
        <div className="mx-auto mb-6 max-w-5xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {savedMessage}
        </div>
      )}

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <section className="border border-neutral-300 bg-white/70 p-6">
          <h2 className="mb-5 text-xl font-medium">컬렉션 정보</h2>
          <p className="mb-5 mt-2 text-sm text-neutral-500">
            제목, 소개글, 마무리 글, 공개 상태는 아래 저장 버튼을 눌러
            반영됩니다.
          </p>
          <form action={updateCollection} className="space-y-5">
            <input type="hidden" name="id" value={collection.id} />

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                제목
              </label>
              <input
                name="title"
                defaultValue={collection.title}
                required
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                커버 이미지 URL
              </label>
              <input
                name="coverImageUrl"
                defaultValue={collection.coverImageUrl ?? ""}
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="/samples/cover.jpg"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                소개글
              </label>
              <textarea
                name="intro"
                rows={5}
                defaultValue={collection.intro ?? ""}
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                마무리 글
              </label>
              <textarea
                name="outro"
                rows={4}
                defaultValue={collection.outro ?? ""}
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-600">
                공개 상태
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-start gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="visibility"
                    value="DRAFT"
                    defaultChecked={collection.visibility === "DRAFT"}
                    className="mt-1 accent-neutral-900"
                  />
                  <span>
                    <span className="block font-medium">DRAFT</span>
                    <span className="text-xs text-neutral-500">
                      스튜디오에서만 관리
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    defaultChecked={collection.visibility === "PUBLIC"}
                    className="mt-1 accent-neutral-900"
                  />
                  <span>
                    <span className="block font-medium">PUBLIC</span>
                    <span className="text-xs text-neutral-500">홈에 공개</span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 px-5 py-3 text-sm text-white hover:bg-neutral-700"
            >
              컬렉션 정보 저장
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="border border-neutral-300 bg-white/70 p-6">
            <h2 className="mb-5 text-xl font-medium">아이템 추가</h2>
            <p className="mb-5 mt-2 text-sm text-neutral-500">
              아이템 추가, 수정, 삭제, 순서 변경은 각 버튼을 누르는 즉시
              저장됩니다.
            </p>
            <form action={addItem} className="space-y-4">
              <input type="hidden" name="collectionId" value={collection.id} />

              <select
                name="type"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
                defaultValue="OTHER"
              >
                <option value="BOOK">BOOK</option>
                <option value="MUSIC">MOVIE</option>
                <option value="MUSIC">MUSIC</option>
                <option value="FOOD">FOOD</option>
                <option value="PLACE">PLACE</option>
                <option value="OTHER">OTHER</option>
              </select>

              <input
                name="title"
                required
                placeholder="아이템 제목"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <textarea
                name="note"
                required
                rows={4}
                placeholder="왜 좋아하는지, 왜 이 컬렉션에 넣었는지"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <input
                name="imageUrl"
                placeholder="이미지 URL 또는 /samples/image.jpg"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <input
                name="sourceUrl"
                placeholder="관련 링크 URL"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <button
                type="submit"
                className="w-full bg-neutral-900 px-5 py-3 text-sm text-white hover:bg-neutral-700"
              >
                아이템 추가
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {collection.items.length === 0 ? (
              <div className="border border-neutral-300 bg-white/70 p-6 text-sm text-neutral-500">
                아직 아이템이 없습니다.
              </div>
            ) : (
              collection.items.map((item) => (
                <article
                  key={item.id}
                  className="border border-neutral-300 bg-white/70 p-5"
                >
                  <form action={updateItem} className="space-y-4">
                    <input
                      type="hidden"
                      name="collectionId"
                      value={collection.id}
                    />
                    <input type="hidden" name="itemId" value={item.id} />

                    <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                      <select
                        name="type"
                        defaultValue={item.type}
                        className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                      >
                        <option value="BOOK">BOOK</option>
                        <option value="MUSIC">MUSIC</option>
                        <option value="PLACE">PLACE</option>
                        <option value="LINK">LINK</option>
                        <option value="FOOD">FOOD</option>
                        <option value="OTHER">OTHER</option>
                      </select>

                      <input
                        name="title"
                        defaultValue={item.title}
                        required
                        className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <textarea
                      name="note"
                      defaultValue={item.note}
                      required
                      rows={3}
                      className="w-full border border-neutral-300 px-3 py-2 text-sm leading-6 outline-none focus:border-black"
                    />

                    <input
                      name="imageUrl"
                      defaultValue={item.imageUrl ?? ""}
                      placeholder="이미지 URL 또는 /samples/image.jpg"
                      className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />

                    <input
                      name="sourceUrl"
                      defaultValue={item.sourceUrl ?? ""}
                      placeholder="관련 링크 URL"
                      className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />

                    <button className="bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
                      아이템 저장
                    </button>
                  </form>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
                    <form action={moveItem}>
                      <input
                        type="hidden"
                        name="collectionId"
                        value={collection.id}
                      />
                      <input type="hidden" name="itemId" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button className="border border-neutral-300 px-3 py-2 text-xs">
                        위로
                      </button>
                    </form>

                    <form action={moveItem}>
                      <input
                        type="hidden"
                        name="collectionId"
                        value={collection.id}
                      />
                      <input type="hidden" name="itemId" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button className="border border-neutral-300 px-3 py-2 text-xs">
                        아래로
                      </button>
                    </form>

                    <form action={deleteItem}>
                      <input
                        type="hidden"
                        name="collectionId"
                        value={collection.id}
                      />
                      <input type="hidden" name="itemId" value={item.id} />
                      <button className="border border-red-300 px-3 py-2 text-xs text-red-600">
                        삭제
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
