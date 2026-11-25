let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string | null> {
  // If we have a valid token (with 5 min buffer), return it
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const rawClientId = process.env.OPENPLANTBOOK_CLIENT_ID;
  const rawClientSecret = process.env.OPENPLANTBOOK_CLIENT_SECRET;

  if (!rawClientId || !rawClientSecret) {
    return null;
  }

  // Strip possible quotes if defined in .env as "value"
  const clientId = rawClientId.replace(/^["']|["']$/g, "").trim();
  const clientSecret = rawClientSecret.replace(/^["']|["']$/g, "").trim();

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await fetch("https://open.plantbook.io/api/v1/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(3500),
    });

    if (!res.ok) {
      console.warn("Open Plantbook token request returned non-OK:", res.status);
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token || null;
    const expiresIn = data.expires_in || 86400;
    tokenExpiry = Date.now() + expiresIn * 1000;

    return cachedToken;
  } catch (error) {
    console.warn("Notice: Open Plantbook token unreachable (offline or invalid credentials):", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function searchPlants(alias: string) {
  const token = await getAccessToken();
  if (!token) return { results: [] };

  try {
    const res = await fetch(
      `https://open.plantbook.io/api/v1/plant/search?alias=${encodeURIComponent(alias)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(3500),
      }
    );

    if (!res.ok) return { results: [] };
    return res.json();
  } catch (err) {
    console.warn("Notice: Open Plantbook search request timed out or failed:", err instanceof Error ? err.message : err);
    return { results: [] };
  }
}

export async function getPlantDetails(pid: string) {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch(
    `https://open.plantbook.io/api/v1/plant/detail/${encodeURIComponent(pid)}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(3500),
    }
  );

  if (!res.ok) throw new Error("Details fetch failed");
  return res.json();
}
