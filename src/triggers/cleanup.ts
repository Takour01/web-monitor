import { db } from "@/lib/db";
import { aiSummaries, pageSnapshots } from "@/lib/db/schema";
import { lt, count, inArray, desc } from "drizzle-orm";
import { schedules } from "@trigger.dev/sdk/v3";

// Configuration: Adjust retention policy
const RETENTION_DAYS = 30; // Delete records older than 30 days
const KEEP_LATEST_RECORDS = 10; // Keep at most 10 recent records per URL

export const cleanupJob = schedules.task({
    id: "cleanup-old-data",
    cron: "0 0 * * *", // Runs daily at midnight UTC
    run: async () => {
        console.log("Running cleanup job...");

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

        // Delete old AI summaries
        await db.delete(aiSummaries).where(lt(aiSummaries.createdAt, cutoffDate));

        // Delete old snapshots
        await db.delete(pageSnapshots).where(lt(pageSnapshots.createdAt, cutoffDate));

        // Limit snapshots per URL to the latest 10
        const snapshots = await db.select({
            urlId: pageSnapshots.url_id,
            id: pageSnapshots.id,
        })
            .from(pageSnapshots)
            .orderBy(desc(pageSnapshots.createdAt));

        const urlsToDelete = snapshots.reduce((acc, snapshot) => {
            // @ts-ignore
            if (!acc[snapshot.urlId]) acc[snapshot.urlId] = [];
            // @ts-ignore
            acc[snapshot.urlId].push(snapshot.id);
            return acc;
        }, {} as Record<number, number[]>);

        for (const urlId in urlsToDelete) {
            const ids = urlsToDelete[urlId];
            if (ids.length > KEEP_LATEST_RECORDS) {
                const deleteIds = ids.slice(KEEP_LATEST_RECORDS);
                await db.delete(pageSnapshots).where(inArray(pageSnapshots.id, deleteIds));
            }
        }

        console.log("Cleanup job completed.");
    },
});
