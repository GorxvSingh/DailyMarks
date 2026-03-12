import { Resend } from "resend";
import { DigestEmail } from "@/emails/DigestEmail";
import type { Bookmark } from "./x-api";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendDigestEmail(
  to: string,
  bookmarks: Bookmark[],
  date: string
) {
  const { error } = await getResend().emails.send({
    from: "DailyMarks <support@dailymarks.online>",
    to,
    subject: `Your Daily Bookmarks - ${date}`,
    react: DigestEmail({ bookmarks, date }),
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
