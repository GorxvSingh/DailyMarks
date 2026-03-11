import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from "@react-email/components";
import type { Bookmark } from "@/lib/x-api";

interface DigestEmailProps {
  bookmarks: Bookmark[];
  date: string;
}

export function DigestEmail({ bookmarks, date }: DigestEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              Daily<span style={{ color: "#004D2C" }}>Marks</span>
            </Text>
            <Text style={dateText}>{date}</Text>
          </Section>

          <Text style={intro}>
            Here are your bookmarks for today. Enjoy revisiting what you saved!
          </Text>

          {bookmarks.map((bookmark, i) => (
            <Section key={bookmark.tweetId}>
              <Section style={tweetCard}>
                <Section style={authorRow}>
                  {bookmark.authorProfileImageUrl && (
                    <Img
                      src={bookmark.authorProfileImageUrl}
                      alt={bookmark.authorName}
                      width={36}
                      height={36}
                      style={avatar}
                    />
                  )}
                  <div>
                    <Text style={authorName}>{bookmark.authorName}</Text>
                    <Text style={authorHandle}>
                      @{bookmark.authorUsername}
                    </Text>
                  </div>
                </Section>

                <Text style={tweetText}>{bookmark.text}</Text>

                <Link href={bookmark.url} style={viewLink}>
                  View on X &rarr;
                </Link>
              </Section>

              {i < bookmarks.length - 1 && <Hr style={divider} />}
            </Section>
          ))}

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you connected your X account to{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL || "#"} style={footerLink}>
                DailyMarks
              </Link>
              .
            </Text>
            <Text style={footerText}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard`}
                style={footerLink}
              >
                Manage preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#fcfcfc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#1e1e1e",
  margin: "0",
};

const dateText = {
  fontSize: "14px",
  color: "#5c5c5c",
  margin: "4px 0 0",
};

const intro = {
  fontSize: "16px",
  color: "#5c5c5c",
  lineHeight: "1.6",
  marginBottom: "32px",
};

const tweetCard = {
  padding: "16px 0",
};

const authorRow = {
  display: "flex" as const,
  alignItems: "center" as const,
  gap: "10px",
  marginBottom: "8px",
};

const avatar = {
  borderRadius: "50%",
};

const authorName = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#1e1e1e",
  margin: "0",
  lineHeight: "1.3",
};

const authorHandle = {
  fontSize: "13px",
  color: "#5c5c5c",
  margin: "0",
  lineHeight: "1.3",
};

const tweetText = {
  fontSize: "15px",
  color: "#1e1e1e",
  lineHeight: "1.6",
  margin: "8px 0 12px",
};

const viewLink = {
  fontSize: "13px",
  color: "#004D2C",
  textDecoration: "none",
  fontWeight: "500" as const,
};

const divider = {
  borderTop: "1px solid #e5e5e5",
  margin: "8px 0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "24px",
};

const footerText = {
  fontSize: "12px",
  color: "#999",
  margin: "4px 0",
};

const footerLink = {
  color: "#004D2C",
  textDecoration: "underline",
};

export default DigestEmail;
