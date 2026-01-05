export const fetchStatus = async () => {
    const res = await fetch(
        "https://www.cloudflarestatus.com/api/v2/summary.json"
    );

    if (!res.ok) {
        throw new Error("Failed to fetch Cloudflare status");
    }

    const data = await res.json();

    return {
        overall: data.status.description,
        services: data.components,
        incidents: data.incidents,
        updatedAt: data.page.updated_at,
    };
}