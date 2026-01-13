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
        <div style="
            padding: 0;
            max-width: 280px;
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            border-radius: 10px;
            overflow: hidden;
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
                <img src="${flag}" alt="${flagAlt || `${country} flag`}" 
                    style="
                        width: 40px;
                        height: 30px;
                        object-fit: cover;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        border: 2px solid rgba(255,255,255,0.3);
                    " />
                <div style="flex: 1;">
                    <a target="_blank" 
                       href="https://en.wikipedia.org/wiki/${encodeURIComponent(country)}"
                       style="
                           color: white;
                           font-size: 16px;
                           font-weight: 700;
                           text-decoration: none;
                           text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                           display: block;
                           transition: opacity 0.2s;
                       "
                       onmouseover="this.style.opacity='0.8'"
                       onmouseout="this.style.opacity='1'"
                    >${country || "N/A"}</a>
                    <div style="
                        color: rgba(255,255,255,0.9);
                        font-size: 11px;
                        margin-top: 2px;
                    ">
                        📍 ${continents.join(", ") || "N/A"}
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div style="padding: 12px;">
                <!-- Stats Grid -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin-bottom: 10px;
                ">
                    <div style="
                        background: white;
                        padding: 8px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                        border: 1px solid #e9ecef;
                    ">
                        <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">
                            Population
                        </div>
                        <div style="color: #2c3e50; font-size: 13px; font-weight: 700;">
                            ${population ? Number(population).toLocaleString() : "N/A"}
                        </div>
                    </div>
                    <div style="
                        background: white;
                        padding: 8px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                        border: 1px solid #e9ecef;
                    ">
                        <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">
                            Area
                        </div>
                        <div style="color: #2c3e50; font-size: 13px; font-weight: 700;">
                            ${area ? `${Number(area).toLocaleString()} km²` : "N/A"}
                        </div>
                    </div>
                </div>

                <!-- Details -->
                <div style="
                    background: white;
                    padding: 10px;
                    border-radius: 6px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    border: 1px solid #e9ecef;
                ">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 14px;">🏛️</span>
                            <div style="flex: 1; min-width: 0;">
                                <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">
                                    Capital
                                </div>
                                <a target="_blank" 
                                   href="https://en.wikipedia.org/wiki/${encodeURIComponent(capital)}"
                                   style="color: #2c3e50; font-size: 12px; font-weight: 500;  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                   onmouseover="this.style.color='#667eea'"
                                   onmouseout="this.style.color='#2c3e50'"
                                >${capital || "N/A"}</a>
                            </div>
                        </div>

                        <div style="height: 1px; background: #e9ecef;"></div>

                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 14px;">💬</span>
                            <div style="flex: 1; min-width: 0;">
                                <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">
                                    Languages
                                </div>
                                <div style="color: #2c3e50; font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${languages ? formatLanguages(languages) : "N/A"}
                                </div>
                            </div>
                        </div>

                        <div style="height: 1px; background: #e9ecef;"></div>

                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 14px;">💰</span>
                            <div style="flex: 1; min-width: 0;">
                                <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">
                                    Currency
                                </div>
                                <a target="_blank" 
                                   href="https://en.wikipedia.org/wiki/${encodeURIComponent(currencies)}"
                                   style="color: #2c3e50; font-size: 12px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                   onmouseover="this.style.color='#667eea'"
                                   onmouseout="this.style.color='#2c3e50'"
                                >${currencies || "N/A"}</a>
                            </div>
                        </div>

                        <div style="height: 1px; background: #e9ecef;"></div>

                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 14px;">🚗</span>
                            <div style="flex: 1;">
                                <div style="color: #6c757d; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">
                                    Driving Side
                                </div>
                                <div style="color: #2c3e50; font-size: 12px; font-weight: 500;">
                                    ${car?.side === "right" ? "Right 🡢" : car?.side === "left" ? "Left 🡠" : "N/A"}
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
    <div style="
        padding: 0;
        max-width: 260px;
        background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
        border-radius: 10px;
        overflow: hidden;
    ">
        <div style="
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
            <div style="color: white; font-size: 20px; margin-bottom: 4px;">✈️</div>
            ${
                link
                    ? `<a target="_blank" href="${link}" style="
                        color: white;
                        font-size: 14px;
                        font-weight: 700;
                        text-decoration: none;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        display: block;
                      " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">${name}</a>`
                    : `<div style="color: white; font-size: 14px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${name}</div>`
            }
        </div>
    </div>
    `;
};