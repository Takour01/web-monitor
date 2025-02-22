import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scrapeLogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const urlId = new URL(req.url).searchParams.get("urlId");
        if (!urlId) return NextResponse.json({ error: "URL ID is required" }, { status: 400 });

        const logs = await db.select().from(scrapeLogs).where(eq(scrapeLogs.urlId, Number(urlId)))
            .orderBy(desc(scrapeLogs.runTime))
            .limit(10);

        return NextResponse.json(logs);
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
