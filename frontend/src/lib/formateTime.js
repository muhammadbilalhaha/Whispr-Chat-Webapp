export function formatTo12HourTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();
}

export function formatDateTime(isoString) {
    if (!isoString) return "Invalid Date";

    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }); // 09:38 AM

    return `${formattedDate}, ${formattedTime}`;
}
