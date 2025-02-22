import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";

// Table to store monitored URLs
export const monitoredUrls = pgTable("monitored_urls", {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    every: integer("every").default(5), // Default: every 5 minutes
    at: integer("at").default(0), // Default: every 5 minutes
});

// Table to store page content snapshots
export const pageSnapshots = pgTable("page_snapshots", {
    id: serial("id").primaryKey(),
    url_id: integer('url_id').references(() => monitoredUrls.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Table for AI-generated summaries
export const aiSummaries = pgTable("ai_summaries", {
    id: serial("id").primaryKey(),
    url_id: integer('url_id').references(() => monitoredUrls.id, { onDelete: "cascade" }),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
