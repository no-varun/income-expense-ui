export const getTransactionTypeBadgeClass = (type = "") => {

    switch (type.toUpperCase()) {
        case "INCOME":
            return "badge bg-success";
        case "EXPENSE":
            return "badge bg-danger";
        case "SAVING":
            return "badge bg-primary";
        default:
            return "badge bg-secondary";
    }

};

export const getPaymentModeBadgeClass = (paymentMode = "") => {

    switch (paymentMode.toUpperCase()) {
        case "CASH":
            return "badge bg-success";
        case "UPI":
            return "badge bg-primary";
        case "CARD":
            return "badge bg-info text-dark";
        case "BANK TRANSFER":
            return "badge bg-dark";
        case "CHEQUE":
            return "badge bg-warning text-dark";
        default:
            return "badge bg-secondary";
    }

};

const categoryPalette = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#ea580c",
    "#4f46e5",
    "#0f766e",
    "#9333ea"
];

const getStableColor = (value = "") => {

    const key = String(value || "category");
    const hash = [...key].reduce(
        (total, character) => total + character.charCodeAt(0),
        0
    );

    return categoryPalette[hash % categoryPalette.length];

};

export const getCategoryBadgeStyle = (category = {}) => ({
    backgroundColor: category?.color || getStableColor(category?.name),
    color: "#ffffff"
});
