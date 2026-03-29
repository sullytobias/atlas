import { DataDrivenPropertyValueSpecification } from "maplibre-gl";

export const CONTINENTS = [
    { name: "Africa", color: "#efaa97", link: "https://en.wikipedia.org/wiki/Africa" },
    { name: "Asia", color: "#8fded1", link: "https://en.wikipedia.org/wiki/Asia" },
    { name: "Europe", color: "#bae7cd", link: "https://en.wikipedia.org/wiki/Europe" },
    { name: "North America", color: "#f4df9c", link: "https://en.wikipedia.org/wiki/North_America" },
    { name: "South America", color: "#f6c7a7", link: "https://en.wikipedia.org/wiki/South_America" },
    { name: "Oceania", color: "#aed5f4", link: "https://en.wikipedia.org/wiki/Oceania" },
    { name: "Antarctica", color: "#edf3f5", link: "https://en.wikipedia.org/wiki/Antarctica" },
];

export function getContinentColorExpression() {
    const expression: any = ["match", ["get", "continent"]];
    
    CONTINENTS.forEach(continent => {
        expression.push(continent.name, continent.color);
    });
    
    expression.push("#d6dee2");
    
    return expression as DataDrivenPropertyValueSpecification<string>;
}
