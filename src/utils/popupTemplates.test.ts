import { describe, expect, it } from "vitest";
import { createAirportPopup, createCountryPopup } from "./popupTemplates";

describe("popupTemplates", () => {
    it("escapes country popup content", () => {
        const popup = createCountryPopup(
            {
                country: '<script>alert("x")</script>',
                flag: "https://example.com/flag.svg",
                flagAlt: 'Flag "quote"',
                population: 1000,
                area: 20,
                capital: "<b>Capital</b>",
                languages: "French",
                currencies: "Euro",
                car: { side: "right" },
                continents: ["Europe"],
            },
            () => "French"
        );

        expect(popup).not.toContain("<script>alert");
        expect(popup).toContain("&lt;script&gt;alert");
        expect(popup).toContain("&lt;b&gt;Capital&lt;/b&gt;");
    });

    it("rejects unsafe airport links", () => {
        const popup = createAirportPopup({
            name: "Unsafe",
            link: "javascript:alert(1)",
        });

        expect(popup).not.toContain("javascript:alert");
        expect(popup).toContain("Unsafe");
    });
});
