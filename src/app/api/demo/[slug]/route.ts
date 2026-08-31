import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [website] = await db.select().from(websites).where(eq(websites.slug, slug)).limit(1);
    if (!website) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db
      .update(websites)
      .set({ viewCount: (website.viewCount || 0) + 1 })
      .where(eq(websites.id, website.id));

    return NextResponse.json({ website });
  } catch (error: any) {
  console.error("BUSINESS SEARCH ERROR:", error);
  console.error("ERROR MESSAGE:", error?.message);
  console.error("ERROR CAUSE:", error?.cause);

  return NextResponse.json(
    {
      error: error?.message || "Business search failed",
      details: error?.cause?.message || null,
    },
    { status: 500 }
  );
}
}