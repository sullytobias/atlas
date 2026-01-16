import "../styles/popup.css";

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

    return `
        <div class="popup-container">
            <div class="popup-header">
                <img class="popup-flag" src="${flag}" alt="${
        flagAlt || `${country} flag`
    }" />
                <div style="flex: 1;">
                    <a target="_blank"
                        href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                            country
                        )}"
                        class="popup-title"
                        onmouseover="this.style.opacity='0.8'"
                        onmouseout="this.style.opacity='1'"
                    >${country || "N/A"}</a>
                    <div class="popup-continents">📍 ${
                        continents.join(", ") || "N/A"
                    }</div>
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
                                <a target="_blank"
                                    href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                                        capital
                                    )}"
                                    class="popup-detail-value"
                                    style="text-decoration: none;"
                                    onmouseover="this.style.color='#667eea'"
                                    onmouseout="this.style.color='#2c3e50'"
                                >${capital || "N/A"}</a>
                            </div>
                        </div>
                        <div class="popup-divider"></div>
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">💬</span>
                            <div style="flex: 1; min-width: 0;">
                                <div class="popup-detail-label">Languages</div>
                                <div class="popup-detail-value">
                                    ${
                                        languages
                                            ? formatLanguages(languages)
                                            : "N/A"
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="popup-divider"></div>
                        <div class="popup-detail-row">
                            <span style="font-size: 14px;">💰</span>
                            <div style="flex: 1; min-width: 0;">
                                <div class="popup-detail-label">Currency</div>
                                <a target="_blank"
                                    href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                                        currencies
                                    )}"
                                    class="popup-detail-value"
                                    style="text-decoration: none;"
                                    onmouseover="this.style.color='#667eea'"
                                    onmouseout="this.style.color='#2c3e50'"
                                >${currencies || "N/A"}</a>
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
    return `
        <div class="popup-container" style="max-width:260px;">
            <div class="popup-airport-header">
                <div class="popup-airport-icon">✈️</div>
                ${
                    link
                        ? `<a target="_blank" href="${link}" class="popup-airport-title" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">${name}</a>`
                        : `<div class="popup-airport-title">${name}</div>`
                }
            </div>
        </div>
    `;
};
