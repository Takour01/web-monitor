import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { monitoredUrls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Fetch all monitored URLs
export async function GET() {
    const urls = await db.select().from(monitoredUrls);
    return NextResponse.json(urls);
}

// Add a new monitored URL
export async function POST(req: Request) {
    try {
        const { url, every, at } = await req.json();
        if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });
        console.log(url, every, at);



        const createdUrl = await db.insert(monitoredUrls).values({ url, createdAt: new Date(), every, at }).returning();

        return NextResponse.json({ message: "URL added successfully", url: createdUrl });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Failed to add URL" }, { status: 500 });
    }
}

// Delete a monitored URL
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await db.delete(monitoredUrls).where(eq(monitoredUrls.id, id));
        return NextResponse.json({ message: "URL deleted successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
    }
}
