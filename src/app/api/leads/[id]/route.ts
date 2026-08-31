import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, activities, notes, tasks, websites } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ======================================================
// GET SINGLE LEAD
// /api/leads/[id]
// ======================================================

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid lead ID",
        },
        {
          status: 400,
        }
      );
    }

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    const [
      leadActivities,
      leadNotes,
      leadTasks,
      leadWebsites,
    ] = await Promise.all([
      db
        .select()
        .from(activities)
        .where(eq(activities.leadId, leadId))
        .orderBy(desc(activities.createdAt)),

      db
        .select()
        .from(notes)
        .where(eq(notes.leadId, leadId))
        .orderBy(desc(notes.createdAt)),

      db
        .select()
        .from(tasks)
        .where(eq(tasks.leadId, leadId))
        .orderBy(desc(tasks.createdAt)),

      db
        .select()
        .from(websites)
        .where(eq(websites.leadId, leadId))
        .orderBy(desc(websites.createdAt)),
    ]);

    return NextResponse.json({
      lead,
      activities: leadActivities,
      notes: leadNotes,
      tasks: leadTasks,
      websites: leadWebsites,
    });
  } catch (error: unknown) {
    console.error("GET SINGLE LEAD ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    if (message === "Unauthorized") {
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
        error: "Failed to fetch lead",
        details: message,
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// UPDATE SINGLE LEAD
// PATCH /api/leads/[id]
// ======================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAuth();

    const { id } = await context.params;
    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid lead ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await req.json();

    const [existingLead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    const updateData: Partial<typeof leads.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.businessName !== undefined) {
      updateData.businessName =
        body.businessName?.trim() || existingLead.businessName;
    }

    if (body.category !== undefined) {
      updateData.category =
        body.category?.trim() || existingLead.category;
    }

    if (body.address !== undefined) {
      updateData.address =
        body.address?.trim() || null;
    }

    if (body.city !== undefined) {
      updateData.city =
        body.city?.trim() || null;
    }

    if (body.state !== undefined) {
      updateData.state =
        body.state?.trim() || null;
    }

    if (body.country !== undefined) {
      updateData.country =
        body.country?.trim() || null;
    }

    if (body.postalCode !== undefined) {
      updateData.postalCode =
        body.postalCode?.trim() || null;
    }

    if (body.phone !== undefined) {
      updateData.phone =
        body.phone?.trim() || null;
    }

    if (body.email !== undefined) {
      updateData.email =
        body.email?.trim() || null;
    }

    if (body.website !== undefined) {
      const website =
        body.website?.trim() || null;

      updateData.website = website;
      updateData.hasWebsite = Boolean(website);
    }

    if (body.latitude !== undefined) {
      updateData.latitude =
        body.latitude || null;
    }

    if (body.longitude !== undefined) {
      updateData.longitude =
        body.longitude || null;
    }

    if (body.osmId !== undefined) {
      updateData.osmId =
        body.osmId || null;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.revenue !== undefined) {
      updateData.revenue =
        body.revenue === null
          ? null
          : Number(body.revenue);
    }

    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags)
        ? body.tags
        : null;
    }

    if (
      body.metadata !== undefined ||
      body.whatsapp !== undefined ||
      body.businessDescription !== undefined
    ) {
      const existingMetadata =
        existingLead.metadata &&
        typeof existingLead.metadata === "object" &&
        !Array.isArray(existingLead.metadata)
          ? existingLead.metadata
          : {};

      const incomingMetadata =
        body.metadata &&
        typeof body.metadata === "object" &&
        !Array.isArray(body.metadata)
          ? body.metadata
          : {};

      updateData.metadata = {
        ...existingMetadata,
        ...incomingMetadata,

        ...(body.whatsapp !== undefined
          ? {
              whatsapp:
                body.whatsapp?.trim() || null,
            }
          : {}),

        ...(body.businessDescription !== undefined
          ? {
              businessDescription:
                body.businessDescription?.trim() || null,
            }
          : {}),
      };
    }

    const [updatedLead] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId))
      .returning();

    if (
      body.status !== undefined &&
      body.status !== existingLead.status
    ) {
      await db
        .insert(activities)
        .values({
          leadId,
          userId: user.id,
          type: "status_changed",
          description:
            `Lead status changed from ${existingLead.status} to ${updatedLead.status}`,
          metadata: {
            previousStatus: existingLead.status,
            newStatus: updatedLead.status,
          },
        });
    }

    return NextResponse.json({
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error: unknown) {
    console.error("UPDATE LEAD ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    if (message === "Unauthorized") {
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
        error: "Failed to update lead",
        details: message,
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// DELETE SINGLE LEAD
// DELETE /api/leads/[id]
// ======================================================

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid lead ID",
        },
        {
          status: 400,
        }
      );
    }

    const [existingLead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    await db
      .delete(activities)
      .where(eq(activities.leadId, leadId));

    await db
      .delete(notes)
      .where(eq(notes.leadId, leadId));

    await db
      .delete(tasks)
      .where(eq(tasks.leadId, leadId));

    await db
      .delete(websites)
      .where(eq(websites.leadId, leadId));

    await db
      .delete(leads)
      .where(eq(leads.id, leadId));

    return NextResponse.json({
      message: "Lead deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE LEAD ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    if (message === "Unauthorized") {
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
        error: "Failed to delete lead",
        details: message,
      },
      {
        status: 500,
      }
    );
  }
}
