export const toBanglaNumber = (number: number) => {
    return number
        .toString()
        .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
};

export const getBanglaUnit = (unit: string) => {
    if (unit === "kg") return "প্রতি কেজি";
    if (unit === "litre") return "প্রতি লিটার";
    if (unit === "dozen") return "প্রতি ডজন";
    if (unit === "piece") return "প্রতি পিস";
    return unit;
};

export const getBanglaDate = () => {
    return new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};