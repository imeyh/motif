import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ExportRouteProps = {
    params: Promise<{
        id: string;
    }>;
};

type SnapshotItem = {
  type: string;
  title: string;
  note: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  position: number;
};

type Snapshot = {
  template?: string;
  title: string;
  intro?: string | null;
  outro?: string | null;
  coverImageUrl?: string | null;
  items: SnapshotItem[];
};

export async function GET(_: Request, { params }: ExportRouteProps) {
    const { id } = await params;

    const order = await prisma.bookOrder.findUnique({
        where: { id },
        include: {
            collection: true,
        },
    });

    if (!order) {
        return NextResponse.json(
            {
                error: "Order not found",
            },
            { status: 404 },
        );
    }

    const snapshot = JSON.parse(order.snapshotJson) as Snapshot;

    const exportData = {
        exportVersion: "1.0",
        exportedAt: new Date().toISOString(),

        order: {
            id: order.id,
            status: order.status,
            requesterNote: order.requesterNote,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        },

        collection: {
            id: order.collectionId,
            title: order.collection.title,
            deletedAt: order.collection.deletedAt,
        },

        book: {
            template: snapshot.template ?? "ESSAY",
            title: snapshot.title,
            intro: snapshot.intro,
            outro: snapshot.outro,
            coverImageUrl: snapshot.coverImageUrl,

            contents: snapshot.items.map((item) => ({
                type: item.type,
                title: item.title,
                note: item.note,
                imageUrl: item.imageUrl,
                sourceUrl: item.sourceUrl,
                position: item.position,
            })),
        },
    };

    return NextResponse.json(exportData, {
        headers: {
            "Content-Disposition": `attachment; filename="motif-order-${order.id}.json"`,
        },
    });
}