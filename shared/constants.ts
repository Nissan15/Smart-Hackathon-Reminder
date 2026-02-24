export const DEPARTMENTS = [
    "AI & DS - Artificial Intelligence and Data Science",
    "CSE - Computer Science and Engineering",
    "AI & ML - Artificial Intelligence and Machine learning",
    "CSBS - Computer Science and Business Systems",
    "Others"
] as const;

export type Department = typeof DEPARTMENTS[number];
export const SECTIONS = ["A", "B", "C", "None"] as const;
export type Section = typeof SECTIONS[number];

// Graduation years — matches the profile forms (2027 → 2036)
export const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => (2027 + i).toString());
