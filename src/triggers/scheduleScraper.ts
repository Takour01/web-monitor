import { schedules } from "@trigger.dev/sdk/v3";
import { db } from "@/lib/db";
import { monitoredUrls } from "@/lib/db/schema";
import { scrapeJob } from "@/lib/jobs/scrapeJob";
import { generateCronExpression } from "@/lib/jobs/generateCronExpression";

export const scraperTrigger = schedules.task({
    id: "centralized-scraper-task",
    // cron: process.env.NODE_ENV !== "production" ? "*/1 * * * *" : "0 * * * *", // Dev: 1 min, Prod: 1 hour
    cron: "*/1 * * * *",
    run: async () => {
        console.log("Running centralized scraper trigger...");




        // Fetch all monitored URLs
        const urls = await db.select().from(monitoredUrls);

        urls.forEach(async (url) => {
            const intervalMinutes = url.every || 0;
            const atMinute = url.at || 0;


            // Check if the URL should be scraped
            if (generateCronExpression(intervalMinutes, atMinute)) {
                console.log(`Triggering scrape for ${url.url}`);
                await scrapeJob(url.url, url.id);
            }
        });

        console.log("Scraper trigger execution completed.");
    },
});
