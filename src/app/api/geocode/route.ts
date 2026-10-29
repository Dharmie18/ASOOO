import { NextRequest, NextResponse } from "next/server";

interface OpenMeteoGeocodeItem {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&country_code=NG&language=en&format=json`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const rawResults: OpenMeteoGeocodeItem[] = data.results || [];

    const results = rawResults.map((item) => ({
      id: String(item.id),
      name: item.name,
      state: item.admin1 || "",
      country: "Nigeria",
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ results: [] });
  }
}
