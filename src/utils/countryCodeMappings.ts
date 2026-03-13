export const CODE_MAPPING: Record<string, string> = {
    SSD: "SDS",
    UNK: "KOS",
    PSE: "PSX",
    ESH: "SAH",
};

export const ADDITIONAL_TERRITORIES: Record<string, string[]> = {
    CYP: ["CYN"],
    SOM: ["SOL"],
    AFG: ["KAB"],
};

export const REVERSE_CODE_MAPPING: Record<string, string> = {
    SDS: "SSD",
    KOS: "UNK",
    PSX: "PSE",
    SAH: "ESH",
    CYN: "CYP",
    SOL: "SOM",
    KAB: "AFG",
};
