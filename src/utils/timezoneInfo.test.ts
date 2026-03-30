import { describe, expect, it } from "vitest";
import { buildTimezoneInfo } from "./timezoneInfo";

describe("buildTimezoneInfo", () => {
    it("builds current offset and no DST state for UTC", () => {
        const info = buildTimezoneInfo(
            "Africa/Abidjan",
            new Date("2026-03-29T12:00:00.000Z"),
        );

        expect(info.offsetLabel).toBe("UTC");
        expect(info.observesDst).toBe(false);
        expect(info.isDstActive).toBe(false);
        expect(info.cityLabel).toBe("Abidjan");
    });

    it("detects DST-aware zones", () => {
        const info = buildTimezoneInfo(
            "Europe/Paris",
            new Date("2026-07-15T12:00:00.000Z"),
        );

        expect(info.offsetLabel).toMatch(/^UTC\+/);
        expect(info.observesDst).toBe(true);
        expect(info.isDstActive).toBe(true);
    });
});
