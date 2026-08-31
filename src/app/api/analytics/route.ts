import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, emails, websites, tasks } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await requireAuth();

    const [leadStats, emailStats, websiteStats, taskStats, statusBreakdown, revenueStats] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(leads),
      db.select({ count: sql<number>`count(*)`, opened: sql<number>`sum(case when opened then 1 else 0 end)` }).from(emails),
      db.select({ count: sql<number>`count(*)`, views: sql<number>`sum(view_count)` }).from(websites),
      db.select({ count: sql<number>`count(*)`, completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)` }).from(tasks),
      db.select({ status: leads.status, count: sql<number>`count(*)` }).from(leads).groupBy(leads.status),
      db.select({ total: sql<number>`sum(revenue)` }).from(leads).where(sql`revenue is not null`),
    ]);

    return NextResponse.json({
      leads: { total: leadStats[0]?.count || 0 },
      emails: { total: emailStats[0]?.count || 0, opened: emailStats[0]?.opened || 0 },
      websites: { total: websiteStats[0]?.count || 0, views: websiteStats[0]?.views || 0 },
      tasks: { total: taskStats[0]?.count || 0, completed: taskStats[0]?.completed || 0 },
      statusBreakdown,
      revenue: revenueStats[0]?.total || 0,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
