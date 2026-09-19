import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  emails,
  leads,
  activities,
  websites,
} from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import nodemailer from "nodemailer";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

async function generateWithGroq(prompt: string) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your-groq-api-key") {
    return null;
  }

  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GROQ ERROR:", res.status, errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GROQ FETCH ERROR:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const {
      leadId,
      templateId,
      customSubject,
      customBody,
    } = await req.json();

    if (!leadId) {
      return NextResponse.json(
        {
          error: "Lead ID is required",
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

    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.leadId, leadId))
      .orderBy(desc(websites.createdAt))
      .limit(1);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const demoUrl =
      website?.demoUrl ||
      (website?.slug
        ? `${appUrl}/demo/${website.slug}`
        : null);

    console.log("LEAD:", lead.businessName);
    console.log("DEMO URL:", demoUrl);

    let subject = customSubject?.trim();
    let body = customBody?.trim();

    if (!subject || !body) {
      const prompt = `
Write a highly convincing, personalized sales outreach email from a Web Design Agency.

Business name:
${lead.businessName}

Business category:
${lead.category}

Business city:
${lead.city || "their city"}

We have already prepared a free website preview for this business.

Demo website URL:
${demoUrl || "Demo available on request"}

Requirements:
- Keep the email short, punchy, and highly professional.
- State that their current online presence could be improved to get more customers.
- Explain that we took the liberty to create a FREE custom website demo for them.
- Include the demo website URL prominently.
- Explain that if they like the demo, we can get it live for their business within 24-48 hours for a very reasonable price.
- End with a strong call to action asking them to reply to the email or click the link in the demo.
- Do not use markdown or code fences.

Return ONLY valid JSON using this exact structure:

{
  "subject": "Email subject (Make it catchy, e.g. 'A new website for [Business]')",
  "body": "Email body"
}
`;

      const groqResponse = await generateWithGroq(prompt);

      try {
        const content =
          groqResponse?.choices?.[0]?.message?.content || "";

        if (content) {
          const parsed = JSON.parse(content);

          subject = parsed.subject?.trim();
          body = parsed.body?.trim();

          console.log("AI EMAIL GENERATED");
        }
      } catch (error) {
        console.error(
          "FAILED TO PARSE GROQ RESPONSE:",
          error
        );
      }
    }

    if (!subject) {
      subject = `A new custom website for ${lead.businessName} (Free Demo inside)`;
    }

    if (!body) {
      body = `Hi ${lead.businessName} team,

I was looking for ${lead.category} businesses in ${
        lead.city || "your city"
      } and noticed that your online presence could be improved to bring in more customers.

As a web design agency, we took the liberty of creating a FREE custom website preview specifically for ${lead.businessName}.

${
  demoUrl
    ? `You can view your working demo right here:
${demoUrl}`
    : "Your custom demo is ready."
}

If you like what you see, we can fully customize it with your exact services, photos, and branding, and get it live in just 24-48 hours.

Take a look at the demo and let me know if you'd like to discuss getting this live for your business!

Best regards,
Your Web Design Partner`;
    }

    const fromEmail =
      process.env.FROM_EMAIL ||
      process.env.SMTP_USER ||
      "noreply@aiagency.com";

    const toEmail = lead.email?.trim() || "";

    if (!toEmail) {
      return NextResponse.json(
        {
          error: "Lead email address is missing",
        },
        {
          status: 400,
        }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(
      process.env.SMTP_PORT || "587"
    );

    let emailStatus = "demo";

    const smtpConfigured =
      smtpHost &&
      smtpUser &&
      smtpPass &&
      smtpHost !== "smtp.example.com" &&
      !smtpUser.includes("your-") &&
      !smtpPass.includes("your-");

    if (smtpConfigured) {
      console.log(
        "SMTP configured. Sending real email..."
      );

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.verify();

      const mailInfo = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject,
        text: body,
      });

      emailStatus = "sent";

      console.log("EMAIL SENT TO:", toEmail);
      console.log(
        "EMAIL MESSAGE ID:",
        mailInfo.messageId
      );
    } else {
      console.log("SMTP not configured.");
      console.log("Running email in DEMO MODE.");

      console.log({
        to: toEmail,
        subject,
        body,
        demoUrl,
      });
    }

    const [email] = await db
      .insert(emails)
      .values({
        leadId,
        subject,
        body,
        fromEmail,
        toEmail,
        status: emailStatus,
        templateId: templateId || null,
      })
      .returning();

    await db.insert(activities).values({
      leadId,
      userId: user.id,
      type: "email_sent",
      description:
        emailStatus === "sent"
          ? `Email sent: ${subject}`
          : `Email demo created: ${subject}`,
      metadata: {
        emailId: email.id,
        demoUrl,
        status: emailStatus,
      },
    });

    return NextResponse.json({
      success: true,
      email,
      demoUrl,
    });
  } catch (error: any) {
    console.error("SEND EMAIL ERROR:", error);

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
        error: "Failed to send email",
        details:
          error?.message || "Unknown email error",
      },
      {
        status: 500,
      }
    );
  }
}