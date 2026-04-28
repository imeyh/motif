import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type CollectionDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const collection = await prisma.collection.findUnique({
    where: { slug: decodedSlug },
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
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-8 text-neutral-900">
      <header className="mx-auto mb-12 flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-sm text-neutral-500 hover:text-black">
          MOTIF
        </Link>

        <Link
          href="/studio"
          className="rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm text-neutral-700 hover:bg-white"
        >
          Studio
        </Link>
      </header>

      <article className="mx-auto max-w-3xl">
        <section className="mb-14 pb-12">
          <p className="mb-4 text-sm tracking-[0.3em] text-neutral-500">
            MOTIF COLLECTION
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {collection.title}
          </h1>

          <p className="mt-8 text-sm text-neutral-500">
            {collection.items.length}개의 취향 조각으로 구성된 컬렉션
          </p>

          {collection.intro && (
            <p className="mt-8 whitespace-pre-line text-lg leading-8 text-neutral-700">
              {collection.intro}
            </p>
          )}
        </section>

        <section className="space-y-20">
          {collection.items.map((item) => (
            <section
              key={item.id}
              className="border-t border-neutral-300 pt-10"
            >
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-base font-medium tracking-[0.18em] text-neutral-500">
                  {item.type}
                </span>

                <span className="text-neutral-300">|</span>

                <h2 className="text-base font-medium tracking-[0.18em] text-neutral-500">
                  {item.title}
                </h2>
              </div>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full object-contain"
                />
              )}

              <p className="max-w-2xl whitespace-pre-line text-base leading-8 text-neutral-700">
                {item.note}
              </p>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-neutral-500 underline underline-offset-4 hover:text-black"
                >
                  관련 링크 보기
                </a>
              )}
            </section>
          ))}
        </section>

        {collection.outro && (
          <section className="mt-20 border-t border-neutral-300 pt-10">
            <p className="whitespace-pre-line text-lg leading-8 text-neutral-700">
              {collection.outro}
            </p>
          </section>
        )}

        <section className="mt-12 flex justify-center">
          <Link
            href={`/studio/collections/${collection.id}/order`}
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700"
          >
            이 컬렉션을 책으로 남기기
          </Link>
        </section>
      </article>
    </main>
  );
}
