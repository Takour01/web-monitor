# 🕵️‍♂️ Web Content Monitor with AI Summary

## 📌 Overview

This is a **Next.js-based web content monitoring system** that:

- Scrapes web pages at scheduled intervals.
- Uses AI (Gemini AI) to generate summaries of content changes.
- Logs scraping history and execution details.
- Sends notifications via **Slack** when changes are detected.
- Automatically cleans up old records to prevent database growth.

## 🚀 Features

✅ **Automated Web Scraping** – Extracts content from monitored URLs at specified intervals.  
✅ **AI-Generated Summaries** – Compares old and new content and generates a concise summary.  
✅ **Scheduling with Trigger.dev** – Uses **Trigger.dev** to schedule and run scraping jobs.  
✅ **Slack Notifications** – Sends a message when changes are detected.  
✅ **Scraping History Logging** – Tracks job execution status (success/failure).  
✅ **Auto-Cleanup** – Deletes old AI summaries & page snapshots after 30 days.

---

## ⚙️ **Setup & Installation**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/Takour01/web-monitor.git
cd web-monitor
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env.local` file and add:

```ini
DATABASE_URL=postgresql://username:password@localhost:5432/monitor
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GOOGLE_API_KEY=your-ai-api-key
```

Replace placeholders with your actual **PostgreSQL database credentials and Slack webhook URL.**

### **4️⃣ Generate and Run Database Migrations**

```sh
npx drizzle-kit generate
npx drizzle-kit push
```

### **5️⃣ Start the Development Server**

```sh
npm run dev
```

The app will run on `http://localhost:3000`.

### **6️⃣ Start the Trigger.dev Worker**

```sh
npx trigger.dev dev
```

This runs the **background jobs** for scraping and cleanup.

---

## 📌 Usage Guide

### **🔹 Add a Monitored URL**

- Go to the **dashboard.**
- Click **"Add URL"..**
- Select how often to check (`every`minutes/hours/days) and at what time (`at` minute).
- Click **"Save"**.

### **🔹 View AI Summaries**

- Navigate to **AI Summaries** to see summaries of monitored pages.

### **🔹 Enable/Disable Slack Alerts**

- Currently, **all URLs send Slack notifications** (future updates will allow toggling notifications per URL).

### **🔹 View Scraping History**

- Each monitored URL has a **history log** that tracks job execution (Success/Failed).

---

## 🚀 Deployment

### **Deploy to Production**

- Run the following commands:

```sh
npm run build
npm run dev
npx trigger.dev deploy
```

- Make sure to **update your environment variables** for production.

## 🛠️ Tech Stack

- **Frontend:** Next.js (React, TailwindCSS)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Drizzle ORM)
- **AI:** Gemini AI
- **Task Scheduler:** Trigger.dev
- **Notifications:** Slack Webhooks

## 📧 Contact

For questions or contributions, contact `takourmotaher@gmail.com`.
