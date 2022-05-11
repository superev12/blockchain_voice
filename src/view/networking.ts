// This is the networking place

export async function fetchDigest(): Promise<Object> {
    console.log("Fetching digest");
    const response = await fetch("digest.json")
    const body = await response.json();
    return body;
}
