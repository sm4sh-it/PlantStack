let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string | null> {
  // If we have a valid token (with 5 min buffer), return it
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const clientId = process.env.OPENPLANTBOOK_CLIENT_ID;
  const clientSecret = process.env.OPENPLANTBOOK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Open Plantbook API credentials missing in .env");
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const res = await fetch('https://open.plantbook.io/api/v1/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      console.error("Failed to fetch Open Plantbook token", await res.text());
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    // Assuming 'expires_in' is in seconds
    const expiresIn = data.expires_in || 86400; 
    tokenExpiry = Date.now() + (expiresIn * 1000);

    return cachedToken;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export async function searchPlants(alias: string) {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch(`https://open.plantbook.io/api/v1/plant/search?alias=${encodeURIComponent(alias)}&limit=10`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getPlantDetails(pid: string) {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token");

  const res = await fetch(`https://open.plantbook.io/api/v1/plant/detail/${encodeURIComponent(pid)}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Details fetch failed");
  return res.json();
}
