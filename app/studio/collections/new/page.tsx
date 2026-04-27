import Link from "next/link";
import { createCollection } from "./actions";

export default function NewCollectionPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-10 max-w-3xl">
        <Link href="/studio" className="text-sm text-neutral-500 hover:text-black">
          ← Studio
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">새 컬렉션 만들기</h1>
        <p className="mt-2 text-sm text-neutral-500">
          제목과 간단한 설명으로 컬렉션을 시작하세요
        </p>
      </header>

      <section className="mx-auto max-w-3xl border border-neutral-300 bg-white/70 p-6">
        <form action={createCollection} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-neutral-600">제목</label>
            <input
              name="title"
              required
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="예: 비 오는 날 생각나는 것들"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-600">소개 (intro)</label>
            <textarea
              name="intro"
              rows={4}
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="컬렉션에 대한 짧은 설명"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-600">마무리 (outro)</label>
            <textarea
              name="outro"
              rows={4}
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="마무리 문장"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-neutral-700"
            >
              생성하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}