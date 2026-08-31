import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, activities } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, desc, sql, and, like } from "drizzle-orm";

// ======================================================
// GET ALL LEADS
// Dashboard + Leads page ke liye
// ======================================================

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const page = Math.max(
      parseInt(searchParams.get("page") || "1"),
      1
    );

    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20"), 1),
      100
    );

    const offset = (page - 1) * limit;

    const conditions = [];

    if (status) {
      conditions.push(eq(leads.status, status as any));
    }

    if (category) {
      conditions.push(eq(leads.category, category));
    }

    if (search) {
      conditions.push(
        like(leads.businessName, `%${search}%`)
      );
    }

    const whereClause =
      conditions.length > 0
        ? and(...conditions)
        : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(leads)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({
      leads: data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("GET LEADS ERROR:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch leads",
        details: error.message,
      },
      { status: 500 }
    );
  }
}


// ======================================================
// CREATE LEAD
// Manual Business Add ke liye
// ======================================================

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const businessName = body.businessName?.trim();
    const category = body.category?.trim();

    if (!businessName) {
      return NextResponse.json(
        {
          error: "Business name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Business category is required",
        },
        {
          status: 400,
        }
      );
    }

    const website =
      body.website?.trim() || null;

    const metadata = {
      ...(body.metadata || {}),

      whatsapp:
        body.whatsapp?.trim() || null,

      businessDescription:
        body.businessDescription?.trim() || null,

      manuallyAdded: true,
    };

    const [lead] = await db
      .insert(leads)
      .values({
        businessName,

        category,

        address:
          body.address?.trim() || null,

        city:
          body.city?.trim() || null,

        state:
          body.state?.trim() || null,

        country:
          body.country?.trim() || "India",

        postalCode:
          body.postalCode?.trim() || null,

        phone:
          body.phone?.trim() || null,

        email:
          body.email?.trim() || null,

        website,

        hasWebsite: Boolean(website),

        latitude:
          body.latitude || null,

        longitude:
          body.longitude || null,

        osmId:
          body.osmId || null,

        status: "new",

        source:
          body.source || "manual",

        assignedTo: user.id,

        metadata,
      })
      .returning();

    await db
      .insert(activities)
      .values({
        leadId: lead.id,

        userId: user.id,

        type: "search",

        description:
          `Business manually added: ${lead.businessName}`,

        metadata: {
          source: "manual",
          category: lead.category,
        },
      });

    return NextResponse.json(
      {
        message:
          "Business added successfully",

        lead,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "CREATE LEAD ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to add business",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}