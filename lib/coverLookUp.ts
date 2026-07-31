export async function fetchCoverUrl(title: string, author: string): Promise<string | null> {
    try {
        const query = new URLSearchParams({ title, author, limit: "1" });
        const res = await fetch(`https://openlibrary.org/search.json?${query}`);
        const data = await res.json();
        const coverId = data.docs?.[0]?.cover_i;
        return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
    } catch {
        return null;
    }
}