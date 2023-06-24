// Runs geocoding api to find coordinates of the location

import { addFailedLocation } from "../database/db";

// returns {lat: string, lng: string}
export async function geocodeLocation(location) {
  const apiKey = process.env.GEOCODE_API_KEY;
  try {
    const response = await fetch(
      `https://geokeo.com/geocode/v1/search.php?q=${location}&api=${apiKey}`
    );

    const data = await response.json();
    const coords = data.results[0].geometry.location;
    coords.lat = parseFloat(coords.lat);
    coords.lng = parseFloat(coords.lng);
    return coords;
  } catch (error) {
    addFailedLocation(location);
    console.error("Error fetching data:", error);
    return { lat: null, lng: null };
  }
}
