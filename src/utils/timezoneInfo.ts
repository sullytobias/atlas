export interface TimezoneInfo {
    tzid: string;
    cityLabel: string;
    currentTime: string;
    offsetLabel: string;
    observesDst: boolean;
    isDstActive: boolean;
}

function parseUtcOffsetLabel(label: string): number {
    if (label === "UTC") {
        return 0;
    }

    const match = label.match(/^UTC([+-])(\d{1,2})(?::(\d{2}))?$/);

    if (!match) {
        return Number.NaN;
    }
console.log({ label, match });
    const [, sign, hours, minutes = "0"] = match;
    const totalMinutes = Number(hours) * 60 + Number(minutes);

    return sign === "-" ? -totalMinutes : totalMinutes;
}

function getUtcOffsetLabel(tzid: string, date: Date): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tzid,
        timeZoneName: "shortOffset",
        hour: "2-digit",
        minute: "2-digit",
    });
    const offsetPart = formatter
        .formatToParts(date)
        .find(({ type }) => type === "timeZoneName");

    return offsetPart?.value.replace("GMT", "UTC") ?? "UTC";
}

function formatCurrentTime(tzid: string, date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: tzid,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

export function buildTimezoneInfo(
    tzid: string,
    now: Date = new Date(),
): TimezoneInfo {
    const currentYear = now.getUTCFullYear();
    const january = new Date(Date.UTC(currentYear, 0, 1));
    const july = new Date(Date.UTC(currentYear, 6, 1));
    const januaryOffset = getUtcOffsetLabel(tzid, january);
    const julyOffset = getUtcOffsetLabel(tzid, july);
    const currentOffset = getUtcOffsetLabel(tzid, now);
    const januaryMinutes = parseUtcOffsetLabel(januaryOffset);
    const julyMinutes = parseUtcOffsetLabel(julyOffset);
    const currentMinutes = parseUtcOffsetLabel(currentOffset);
    const observesDst =
        Number.isFinite(januaryMinutes) &&
        Number.isFinite(julyMinutes) &&
        januaryMinutes !== julyMinutes;
    const standardOffsetMinutes =
        Number.isFinite(januaryMinutes) && Number.isFinite(julyMinutes)
            ? Math.min(januaryMinutes, julyMinutes)
            : currentMinutes;
    const isDstActive =
        observesDst &&
        Number.isFinite(currentMinutes) &&
        currentMinutes !== standardOffsetMinutes;

    return {
        tzid,
        cityLabel: tzid.split("/").pop()?.replaceAll("_", " ") ?? tzid,
        currentTime: formatCurrentTime(tzid, now),
        offsetLabel: currentOffset,
        observesDst,
        isDstActive,
    };
}
