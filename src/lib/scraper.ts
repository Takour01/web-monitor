import axios from 'axios';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { ScrapingBeeClient } from 'scrapingbee';

// Optional: Use ScrapingBee for bypassing anti-bot measures
const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY || '';

export async function scrapePage(url: string): Promise<string | null> {
    try {
        console.log(`Trying Axios for: ${url}`);
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        return extractContent(data);
    } catch (error: any) {
        console.warn(`Axios failed (${error.message}), trying Playwright...`);
    }

    try {
        console.log(`Trying Playwright for: ${url}`);
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        const content = await page.content();
        await browser.close();
        return extractContent(content);
    } catch (error: any) {
        console.warn(`Playwright failed (${error.message}), trying ScrapingBee...`);
    }

    if (SCRAPINGBEE_API_KEY) {
        try {
            console.log(`Trying ScrapingBee for: ${url}`);
            const client = new ScrapingBeeClient(SCRAPINGBEE_API_KEY);
            const response = await client.get({
                url,
                params: { render_js: true }
            });
            console.log(response);

            return extractContent(response.data);
        } catch (error: any) {
            console.error(`ScrapingBee failed: ${error.message}`);
        }
    }

    console.error(`All scraping methods failed for: ${url}`);
    return null;
}

// Function to clean and extract meaningful text content
function extractContent(html: string): string {
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, aside, ads, img, iframe').remove(); // Remove unnecessary elements
    return $('body').text().replace(/\s+/g, ' ').trim(); // Extract clean text
}
