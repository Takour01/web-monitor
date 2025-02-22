import axios from "axios";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackNotification(message: string) {
    if (!SLACK_WEBHOOK_URL) {
        console.warn("Slack Webhook URL not set");
        return { success: false, message: "Slack Webhook URL not set" }
    }

    try {
        await axios.post(SLACK_WEBHOOK_URL, { text: message });
        console.log("Slack notification sent successfully");
        return { success: true, message: "Slack notification sent successfully" }
    } catch (error) {
        console.error("Failed to send Slack notification:", error);
        return { success: false, message: "Failed to send Slack notification" }

    }
}
