import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageSnapshots } from "@/lib/db/schema";
import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const history = await db
            .select()
            .from(pageSnapshots)
            .where(eq(pageSnapshots.url_id, parseInt(id)))
            .orderBy(desc(pageSnapshots.createdAt))
            .execute();

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
