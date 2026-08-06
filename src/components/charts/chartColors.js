export const chartPalette = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#84CC16", // Lime
    "#E11D48", // Rose
    "#06B6D4", // Cyan
    "#22C55E", // Green
    "#D97706", // Dark Amber
    "#64748B", // Slate
];

export const incomeColor = "#22C55E";
export const incomeBorderColor = "#15803D";

export const expenseColor = "#EF4444";
export const expenseBorderColor = "#B91C1C";

export const getSliceColors = (count, offset = 0) =>
    Array.from(
        { length: count },
        (_, index) => chartPalette[(index + offset) % chartPalette.length]
    );