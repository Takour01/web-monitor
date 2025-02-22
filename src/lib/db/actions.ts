import { db } from './index';
import { monitoredUrls, pageSnapshots, aiSummaries, scrapeLogs } from './schema';
import { scrapePage } from '../scraper';
import { summarizeChanges } from '../../ai';
import { desc, eq } from 'drizzle-orm';
import { sendSlackNotification } from '../slack';

export const addErrorLog = async (urlId: number, error: string) => {
    await db.insert(scrapeLogs).values({
        urlId,
        status: "Failed",
        runTime: new Date(),
        errorMessage: error || "Unknown error",
    });
}
export const addSuccessLog = async (urlId: number) => {
    await db.insert(scrapeLogs).values({
        urlId,
        status: "Success",
        runTime: new Date(),
    });
}





export async function monitorUrl(url_id: number, url: string) {
    const newContent = await scrapePage(url);
    if (!newContent) {
        const errMessage = `Failed to scrape: ${url}`
        await addErrorLog(url_id, errMessage)
        console.error(errMessage);
        return;
    }

    const urlExists = await db.select().from(monitoredUrls).where(eq(monitoredUrls.id, url_id));

    if (!urlExists.length) {
        const errMessage = `Error: URL ID ${url_id} not found in monitored_urls. Insert it first.`
        await addErrorLog(url_id, errMessage)
        console.error(errMessage);
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


    // Send Slack notification
    const notiResult = await sendSlackNotification(`📢 Content Change Detected!\n${summary}`);
    if (!notiResult.success) {
        await addErrorLog(url_id, notiResult.message)
    }


    try {
        // Store snapshot
        await db.insert(pageSnapshots).values({
            url_id,
            content: newContent,
            createdAt: new Date(),
        });

    } catch (error) {
        await addErrorLog(url_id, "error inserting page snapshots")
    }

    try {
        // Store AI summary
        await db.insert(aiSummaries).values({
            url_id,
            summary,
            createdAt: new Date(),
        });

    } catch (error) {
        await addErrorLog(url_id, "error inserting ai summeries")

    }
    console.log(`Scraped and summarized content for: ${url}`);

    await addSuccessLog(url_id)
}
