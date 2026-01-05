export const parseRegion = (name: string): string => {
    const parts = name.split(" - ");
    return parts[0] ?? "Unknown";
};