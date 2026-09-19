import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { leadIds } = await req.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: "No lead IDs provided" },
        { status: 400 }
      );
    }

    // Fetch the leads that match these IDs
    const targetLeads = await db
      .select()
      .from(leads)
      .where(inArray(leads.id, leadIds));

    // To prevent timeout on Vercel (which limits serverless functions to 10s or 60s),
    // we return a successful response immediately and let the client handle the sequential processing,
    // or we process them here. However, generating AI websites takes time (sometimes 10s per site).
    // So the best approach for a simple MVP is to return the validated leads, and have the client
    // loop through them and call the single website generation and email generation endpoints.
    
    // So this endpoint basically just validates the request and returns the list of leads 
    // that have emails and haven't been successfully pitched yet (or all requested).

    const validLeads = targetLeads.filter(lead => !!lead.email);

    return NextResponse.json({
      success: true,
      message: `Found ${validLeads.length} valid leads with emails.`,
      leads: validLeads.map(l => ({ id: l.id, email: l.email, businessName: l.businessName, category: l.category }))
    });

  } catch (error: any) {
    console.error("BULK PITCH VALIDATION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to validate bulk pitch", details: error.message },
      { status: 500 }
    );
  }
}
