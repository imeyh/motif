import Link from "next/link";
import { prisma } from "@/lib/prisma";

const cardBackgrounds = [
  "bg-[#dfe3ea]",
  "bg-[#e4e8e1]",
  "bg-[#e9e2d8]",
  "bg-[#f0e3dc]",
  "bg-[#e6dde7]",
  "bg-[#dde6e4]",
];

export default async function Home() {
  const collections = await prisma.collection.findMany({
    where: {
      visibility: "PUBLIC",
      deletedAt: null,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-neutral-900">
      <header className="mx-auto mb-14 flex max-w-6xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">MOTIF</h1>
          <p className="mt-2 text-sm text-neutral-500">
            취향의 조각을 모아, 나만의 주제로 엮는 아카이브 서비스
          </p>
        </div>

        <Link
          href="/studio"
          className="rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm text-neutral-700 hover:bg-white"
        >
          Studio
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3">
        {collections.map((collection, index) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group block"
          >
            <article
              className={`aspect-square p-5 flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md ${
                cardBackgrounds[index % cardBackgrounds.length]
              }`}
            >
              <div className="mb-5">
                {collection.coverImageUrl ? (
                  <img
                    src={collection.coverImageUrl}
                    alt={collection.title}
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-4/5 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-base font-medium tracking-[0.14em] text-neutral-700">
                  {collection.title}
                </h2>

                <span className="text-neutral-400">|</span>

                <span className="shrink-0 whitespace-nowrap text-sm tracking-[0.12em] text-neutral-500">
                  {collection.items.length}조각
                </span>
              </div>

              {collection.intro && (
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
                  {collection.intro}
                </p>
              )}
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
