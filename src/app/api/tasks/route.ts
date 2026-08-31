import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { leadId, title, description, priority, dueDate } = await req.json();
    const [task] = await db
      .insert(tasks)
      .values({ leadId, userId: user.id, title, description, priority, dueDate: dueDate ? new Date(dueDate) : null })
      .returning();
    return NextResponse.json({ task });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const data = leadId
      ? await db.select().from(tasks).where(eq(tasks.leadId, parseInt(leadId))).orderBy(desc(tasks.createdAt))
      : await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    return NextResponse.json({ tasks: data });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth();
    const { id, status } = await req.json();
    const [task] = await db
      .update(tasks)
      .set({ status, completedAt: status === "completed" ? new Date() : null, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return NextResponse.json({ task });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
