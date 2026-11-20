import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { comments } from "@/db/schema";

export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function GET() {
  try {
    const recent = await getDb().select().from(comments).orderBy(desc(comments.id)).limit(30);
    return json({ comments: recent });
  } catch (error) {
    console.error("Unable to read guestbook comments", error);
    return json({ error: "Komentar belum bisa dimuat." }, 503);
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim();
  if (contentType !== "application/json") {
    return json({ error: "Format komentar tidak didukung." }, 415);
  }

  const input = await request.json().catch(() => null) as {
    name?: unknown;
    message?: unknown;
  } | null;
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const message = typeof input?.message === "string" ? input.message.trim() : "";

  if (!name || name.length > 60 || !message || message.length > 500) {
    return json({ error: "Isi nama dan komentar. Maksimal 60 karakter untuk nama dan 500 karakter untuk komentar." }, 400);
  }

  try {
    const [comment] = await getDb().insert(comments).values({
      name,
      message,
      createdAt: new Date().toISOString(),
    }).returning();
    return json({ comment }, 201);
  } catch (error) {
    console.error("Unable to save guestbook comment", error);
    return json({ error: "Komentar belum bisa disimpan. Coba lagi." }, 503);
  }
}
