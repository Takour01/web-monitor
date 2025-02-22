import { db } from './index';
import { monitoredUrls, pageSnapshots, aiSummaries } from './schema';
import { scrapePage } from '../scraper';
import { summarizeChanges } from '../../ai';
import { desc, eq } from 'drizzle-orm';

export async function monitorUrl(url_id: number, url: string) {
    const newContent = await scrapePage(url);
    if (!newContent) return console.error(`Failed to scrape: ${url}`);

    const urlExists = await db.select().from(monitoredUrls).where(eq(monitoredUrls.id, url_id));

    if (!urlExists.length) {
        console.error(`Error: URL ID ${url_id} not found in monitored_urls. Insert it first.`);
        return;
    }


    // Get last snapshot for this URL
    const lastSnapshot = await db.select().from(pageSnapshots)
        .where(eq(pageSnapshots.url_id, url_id))
        .orderBy(desc(pageSnapshots.createdAt))
        .limit(1)
        .execute();

    const oldContent = lastSnapshot.length > 0 ? lastSnapshot[0].content : "";

    // Compare and summarize
    const summary = await summarizeChanges(oldContent, newContent);

    console.log(summary);


    // Store snapshot
    await db.insert(pageSnapshots).values({
        url_id,
        content: newContent,
        createdAt: new Date(),
    });

    // Store AI summary
    await db.insert(aiSummaries).values({
        url_id,
        summary,
        createdAt: new Date(),
    });

    console.log(`Scraped and summarized content for: ${url}`);
}
