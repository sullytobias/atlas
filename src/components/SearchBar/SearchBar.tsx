import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import countryData from "../../data/data.json";
import {
    getSearchResults,
    type CountryDataItem,
    type SearchResult,
} from "./searchResults";
import "./SearchBar.css";

type Props = {
    onLocationSelect: (
        coordinates: [number, number],
        countryCode: string,
        zoom?: number
    ) => void;
};

const SearchResultItem: React.FC<{
    result: SearchResult;
    onClick: () => void;
    isFocused: boolean;
    id: string;
}> = ({ result, onClick, isFocused, id }) => (
    <button
        id={id}
        type="button"
        className={`search-bar-result-item${isFocused ? " focused" : ""}`}
        onClick={onClick}
        aria-label={`Select ${result.country} (${result.capital})`}
        role="option"
        aria-selected={isFocused}
        tabIndex={-1}
    >
        <div className="search-bar-result-item-main">
            <img
                className="search-bar-result-flag"
                src={result.flag}
                alt={result.flagAlt || `Flag of ${result.country}`}
                width={16}
                height={12}
            />
            <span className="search-bar-result-country">{result.country}</span>
        </div>
        <div className="search-bar-result-capital">
            Capital: {result.capital}
        </div>
    </button>
);

export default function SearchBar({ onLocationSelect }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const countries = useMemo(() => {
        const data = countryData as { features: CountryDataItem[] };
        return data.features;
    }, []);

    const results = useMemo(() => {
        return getSearchResults(countries, searchTerm);
    }, [searchTerm, countries]);

    useEffect(() => {
        if (!searchTerm.trim()) setShowResults(false);
        else setShowResults(true);
        setFocusedIndex(-1);
    }, [searchTerm, results.length]);

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

    const handleResultClick = useCallback(
        (result: SearchResult) => {
            const zoom = 6;
            onLocationSelect(result.coordinates, result.cca3, zoom);
            setSearchTerm("");
            setIsOpen(false);
            setShowResults(false);
            setFocusedIndex(-1);
        },
        [onLocationSelect]
    );

    const handleClear = useCallback(() => {
        setSearchTerm("");
        setShowResults(false);
        setFocusedIndex(-1);
    }, []);

    const handleToggle = useCallback(() => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);
        if (!nextIsOpen) {
            setSearchTerm("");
            setShowResults(false);
            setFocusedIndex(-1);
        } else {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                setShowResults(false);
            } else if (e.key === "ArrowDown") {
                setFocusedIndex((prev) =>
                    Math.min(prev + 1, results.length - 1)
                );
                setShowResults(true);
            } else if (e.key === "ArrowUp") {
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
                setShowResults(true);
            } else if (
                e.key === "Enter" &&
                focusedIndex >= 0 &&
                results[focusedIndex]
            ) {
                handleResultClick(results[focusedIndex]);
            }
        },
        [results, focusedIndex, handleResultClick]
    );

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
                                ref={inputRef}
                                onKeyDown={handleInputKeyDown}
                                aria-label="Search countries or capitals"
                                role="combobox"
                                aria-autocomplete="list"
                                aria-expanded={showResults}
                                aria-controls="search-bar-results-list"
                                aria-haspopup="listbox"
                                aria-activedescendant={
                                    focusedIndex >= 0
                                        ? `search-bar-result-${focusedIndex}`
                                        : undefined
                                }
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

                        {showResults && (
                            <div
                                className="search-bar-results"
                                id="search-bar-results-list"
                                role="listbox"
                            >
                                {results.length > 0
                                    ? results.map((result, index) => (
                                          <SearchResultItem
                                              key={`${result.country}-${index}`}
                                              id={`search-bar-result-${index}`}
                                              result={result}
                                              onClick={() =>
                                                  handleResultClick(result)
                                              }
                                              isFocused={focusedIndex === index}
                                          />
                                      ))
                                    : searchTerm && (
                                          <div className="search-bar-no-results">
                                              No countries or capitals found
                                          </div>
                                      )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
