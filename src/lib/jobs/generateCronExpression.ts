export function generateCronExpression(every: number, at: number): boolean {
    if (every === 0) return false; // Default: Midnight daily
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const minutes = every % 60; // Get remaining minutes
    const hours = Math.floor(every / 60) % 24; // Convert to hours
    const days = Math.floor(every / 1440); // Convert to days

    if (days > 0) {
        if (at === currentHour)
            // Every X days at a specific hour
            return true;
    } else if (hours > 0) {
        // Every X hours at specific minutes
        if (currentMinute === minutes)
            return true;
    } else {
        // Every X minutes
        if (currentMinute % minutes === 0)
            return true;
    }

    return false
}
