import { monitorUrl } from "../db/actions"; // Your scraping function
import { db } from "../db/index";
import { monitoredUrls } from "../db/schema";

export const scrapeJob = async (url: string, id: number) => {
    console.log("Starting scheduled scraping job...");


    console.log(`Scraping: ${url}`);
    await monitorUrl(id, url);

    console.log("✅ Scraping job completed!");
}
