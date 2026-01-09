import { DataDrivenPropertyValueSpecification } from "maplibre-gl";

export const CONTINENTS = [
    { name: "Africa", color: "#FF6B6B", link: "https://en.wikipedia.org/wiki/Africa" },
    { name: "Asia", color: "#4ECDC4", link: "https://en.wikipedia.org/wiki/Asia" },
    { name: "Europe", color: "#95E1D3", link: "https://en.wikipedia.org/wiki/Europe" },
    { name: "North America", color: "#FFE66D", link: "https://en.wikipedia.org/wiki/North_America" },
    { name: "South America", color: "#A8E6CF", link: "https://en.wikipedia.org/wiki/South_America" },
    { name: "Oceania", color: "#C7CEEA", link: "https://en.wikipedia.org/wiki/Oceania" },
    { name: "Antarctica", color: "#F0F0F0", link: "https://en.wikipedia.org/wiki/Antarctica" },
];

export function getContinentColorExpression() {
    const expression: any = ["match", ["get", "continent"]];
    
    CONTINENTS.forEach(continent => {
        expression.push(continent.name, continent.color);
    });
    
    expression.push("#CCCCCC"); 
    
    return expression as DataDrivenPropertyValueSpecification<string>;
}