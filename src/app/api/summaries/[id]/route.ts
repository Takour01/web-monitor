import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiSummaries } from "@/lib/db/schema";
import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const summaries = await db
      .select()
      .from(aiSummaries)
      .where(eq(aiSummaries.url_id, parseInt(id)))
      .orderBy(desc(aiSummaries.createdAt))
      .execute();

    return NextResponse.json(summaries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}
