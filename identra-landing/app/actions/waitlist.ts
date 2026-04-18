"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://identra.dev";
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/identra-logo.svg`;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  try {
    // 1. Add to Resend Audience (Contacts)
    // Replace with your actual Audience ID from the dashboard
    const audienceId = process.env.RESEND_AUDIENCE_ID; 

    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        });
      } catch (error: any) {
        // If contact already exists, continue and still send confirmation email.
        if (!error?.message?.toLowerCase()?.includes("already exists")) {
          throw error;
        }
      }
    }

    // 2. Send the automated welcome email
    await resend.emails.send({
      from: "Identra Team <hello@identra.dev>",
      to: email,
      replyTo: "hello@identra.dev",
      subject: "You're on the Identra waitlist",
      text: `Thanks for joining the Identra waitlist.

We have confirmed your early access request. We'll email you as soon as the next set of invites is available.

If this wasn't you, you can ignore this email.

Identra Team
https://identra.dev`,
      html: `
        <div style="background:#f5f7fb;padding:32px 16px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            <div style="padding:20px 24px;border-bottom:1px solid #e5e7eb;background:#0b1220;">
              <div style="display:flex;align-items:center;gap:10px;">
                <img src="${logoUrl}" alt="Identra" width="180" height="36" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;" />
                <span style="font-size:13px;letter-spacing:1.5px;color:#e5e7eb;font-weight:600;display:none;">IDENTRA</span>
              </div>
            </div>
            <div style="padding:28px 24px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:600;">Your waitlist request is confirmed</h1>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">Thanks for joining the Identra waitlist. We have reserved your place for early access.</p>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">You will receive an email from us when the next invite window opens.</p>
              <div style="margin:18px 0 22px;padding:14px 16px;border:1px solid #dbeafe;background:#f8fbff;border-radius:8px;">
                <div style="font-size:12px;color:#475569;margin-bottom:6px;">Status</div>
                <div style="font-size:14px;color:#0f766e;font-weight:600;">Confirmed for early access</div>
              </div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">If this was not requested by you, no action is required.</p>
            </div>
            <div style="padding:14px 24px;border-top:1px solid #e5e7eb;background:#f8fafc;font-size:12px;color:#64748b;">
              Identra Team | <a href="https://identra.dev" style="color:#334155;text-decoration:none;">identra.dev</a>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      return { error: "You are already on the waitlist." };
    }
    return { error: "Something went wrong. Please try again later." };
  }
}
