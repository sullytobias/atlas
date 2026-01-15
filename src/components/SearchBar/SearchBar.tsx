import { useState, useEffect, useRef, useMemo } from "react";
import countryData from "../../data/data.json";
import "./SearchBar.css";

type CountryDataItem = {
    properties: {
        capital?: string;
        country: string;
        population: number;
        flag: string;
        flagAlt: string;
        cca3: string;
    };
    geometry: {
        type: string;
        coordinates: [number, number] | null[];
    };
};

type SearchResult = {
    country: string;
    capital: string;
    flag: string;
    coordinates: [number, number];
    matchType: "country" | "capital";
};

type Props = {
    onLocationSelect: (coordinates: [number, number], zoom?: number) => void;
};

export default function SearchBar({ onLocationSelect }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

    const countries = useMemo(() => {
        const data = countryData as { features: CountryDataItem[] };
        return data.features;
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filteredResults: SearchResult[] = [];

        countries.forEach((country) => {
            const { properties, geometry } = country;

            if (
                !properties.capital ||
                !geometry.coordinates ||
                geometry.coordinates.length !== 2
            ) {
                return;
            }

            const countryName = properties.country.toLowerCase();
            const capitalName = properties.capital.toLowerCase();
            const coords = geometry.coordinates as [number, number];

            if (countryName.includes(searchLower)) {
                filteredResults.push({
                    country: properties.country,
                    capital: properties.capital,
                    flag: properties.flag,
                    coordinates: coords,
                    matchType: "country",
                });
            } else if (capitalName.includes(searchLower)) {
                filteredResults.push({
                    country: properties.country,
                    capital: properties.capital,
                    flag: properties.flag,
                    coordinates: coords,
                    matchType: "capital",
                });
            }
        });

        filteredResults.sort((a, b) => {
            const aCountry = a.country.toLowerCase();
            const bCountry = b.country.toLowerCase();
            const aCapital = a.capital.toLowerCase();
            const bCapital = b.capital.toLowerCase();

            if (aCountry === searchLower && bCountry !== searchLower) return -1;
            if (bCountry === searchLower && aCountry !== searchLower) return 1;

            if (aCapital === searchLower && bCapital !== searchLower) return -1;
            if (bCapital === searchLower && aCapital !== searchLower) return 1;

            if (a.matchType === "country" && b.matchType === "capital")
                return -1;
            if (a.matchType === "capital" && b.matchType === "country")
                return 1;

            return aCountry.localeCompare(bCountry);
        });

        setResults(filteredResults.slice(0, 10));
        setShowResults(true);
    }, [searchTerm, countries]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleResultClick = (result: SearchResult) => {
        const zoom = 6;
        onLocationSelect(result.coordinates, zoom);
        setSearchTerm("");
        setIsOpen(false);
    };

    const handleClear = () => {
        setSearchTerm("");
        setResults([]);
        setShowResults(false);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setSearchTerm("");
            setResults([]);
            setShowResults(false);
        }
    };

    const wrapperClass = isOpen
        ? "search-bar-wrapper search-bar-wrapper-enter-active"
        : "search-bar-wrapper search-bar-wrapper-exit-active";

    return (
        <div className="search-bar-container" ref={searchBarRef}>
            {!isOpen && (
                <button
                    className="search-bar-trigger"
                    onClick={handleToggle}
                    aria-label="Open search"
                >
                    🔍
                </button>
            )}

            <div
                className={wrapperClass}
                style={{
                    pointerEvents: isOpen ? "auto" : "none",
                    opacity: isOpen ? 1 : 0,
                }}
            >
                {isOpen && (
                    <>
                        <div className="search-bar-input-container">
                            <span className="search-bar-icon">🔍</span>
                            <input
                                type="text"
                                className="search-bar-input"
                                placeholder="Search for a country or capital..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => {
                                    if (results.length > 0)
                                        setShowResults(true);
                                }}
                                autoFocus
                            />
                            {searchTerm && (
                                <button
                                    className="search-bar-clear"
                                    onClick={handleClear}
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                            <button
                                className="search-bar-close"
                                onClick={handleToggle}
                                aria-label="Close search"
                            >
                                ✕
                            </button>
                        </div>

                        {showResults && results.length > 0 && (
                            <div className="search-bar-results">
                                {results.map((result, index) => (
                                    <div
                                        key={`${result.country}-${index}`}
                                        className="search-bar-result-item"
                                        onClick={() =>
                                            handleResultClick(result)
                                        }
                                    >
                                        <div className="search-bar-result-item-main">
                                            <span className="search-bar-result-flag">
                                                🌍
                                            </span>
                                            <span className="search-bar-result-country">
                                                {result.country}
                                            </span>
                                        </div>
                                        <div className="search-bar-result-capital">
                                            Capital: {result.capital}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showResults && results.length === 0 && searchTerm && (
                            <div className="search-bar-results">
                                <div className="search-bar-no-results">
                                    No countries or capitals found
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
