import "../styles/popup.css";

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
    return escapeHtml(value);
}

function sanitizeUrl(value?: string): string | null {
    if (!value) return null;

    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
    } catch {
        return null;
    }

    return null;
}

export const createCountryPopup = (
    props: {
        country: string;
        flag: string;
        flagAlt: string;
        population: number;
        area: number;
        capital: string;
        languages: string;
        currencies: string;
        car: { side: string };
        continents: string[];
    },
    formatLanguages: (languages: string) => string
): string => {
    const {
        country,
        flag,
        flagAlt,
        population,
        area,
        capital,
        languages,
        currencies,
        car,
        continents,
    } = props;
    const safeCountry = escapeHtml(country || "N/A");
    const safeFlagAlt = escapeAttribute(flagAlt || `${country} flag`);
    const safeFlag = sanitizeUrl(flag);
    const safeCapital = escapeHtml(capital || "N/A");
    const safeCurrencies = escapeHtml(currencies || "N/A");
    const safeContinents = escapeHtml(continents.join(", ") || "N/A");
    const safeLanguages = languages ? formatLanguages(languages) : "N/A";
    const countryWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country)}`;
    const capitalWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(capital)}`;
    const currenciesWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(currencies)}`;

    return `
        <div class="popup-container">
            <div class="popup-header">
                ${
                    safeFlag
                        ? `<img class="popup-flag" src="${escapeAttribute(
                              safeFlag
                          )}" alt="${safeFlagAlt}" />`
                        : ""
                }
                <div style="flex: 1;">
                    <a target="_blank" rel="noopener noreferrer"
                        href="${countryWikiUrl}"
                        class="popup-title"
                    >${safeCountry}</a>
                    <div class="popup-continents">📍 ${safeContinents}</div>
                </div>
            </div>
            <div class="popup-content">
                <div class="popup-stats-grid">
                    <div class="popup-stat">
                        <div class="popup-stat-label">Population</div>
                        <div class="popup-stat-value">
                            ${
                                population
                                    ? Number(population).toLocaleString()
                                    : "N/A"
                            }
                        </div>
                    </div>
                    <div class="popup-stat">
                        <div class="popup-stat-label">Area</div>
                        <div class="popup-stat-value">
                            ${
                                area
                                    ? `${Number(area).toLocaleString()} km²`
                                    : "N/A"
                            }
                        </div>
                    </div>
                </div>
                <div class="popup-details">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">🏛️</span>
                            <div style="flex: 1; min-width: 0;">
                                <div class="popup-detail-label">Capital</div>
                                <a target="_blank" rel="noopener noreferrer"
                                    href="${capitalWikiUrl}"
                                    class="popup-detail-value"
                                    style="text-decoration: none;"
                                >${safeCapital}</a>
                            </div>
                        </div>
                        <div class="popup-divider"></div>
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">💬</span>
                            <div style="flex: 1; min-width: 0;">
                                <div class="popup-detail-label">Languages</div>
                                <div class="popup-detail-value">
                                    ${safeLanguages}
                                </div>
                            </div>
                        </div>
                        <div class="popup-divider"></div>
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">💰</span>
                            <div style="flex: 1; min-width: 0;">
                                <div class="popup-detail-label">Currency</div>
                                <a target="_blank" rel="noopener noreferrer"
                                    href="${currenciesWikiUrl}"
                                    class="popup-detail-value"
                                    style="text-decoration: none;"
                                >${safeCurrencies}</a>
                            </div>
                        </div>
                        <div class="popup-divider"></div>
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">🚗</span>
                            <div style="flex: 1;">
                                <div class="popup-detail-label">Driving Side</div>
                                <div class="popup-detail-value">
                                    ${
                                        car?.side === "right"
                                            ? "Right 🡢"
                                            : car?.side === "left"
                                            ? "Left 🡠"
                                            : "N/A"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const createAirportPopup = (props: {
    name: string;
    link?: string;
}): string => {
    const { name, link } = props;
    const safeName = escapeHtml(name);
    const safeLink = sanitizeUrl(link);

    return `
        <div class="popup-container" style="max-width:260px;">
            <div class="popup-airport-header">
                <div class="popup-airport-icon">✈️</div>
                ${
                    safeLink
                        ? `<a target="_blank" rel="noopener noreferrer" href="${escapeAttribute(
                              safeLink
                          )}" class="popup-airport-title">${safeName}</a>`
                        : `<div class="popup-airport-title">${safeName}</div>`
                }
            </div>
        </div>
    `;
};
