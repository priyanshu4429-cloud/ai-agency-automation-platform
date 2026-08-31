import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const data = leadId
      ? await db.select().from(activities).where(eq(activities.leadId, parseInt(leadId))).orderBy(desc(activities.createdAt))
      : await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(50);
    return NextResponse.json({ activities: data });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
