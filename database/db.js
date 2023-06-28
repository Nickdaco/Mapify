import { sql } from "@vercel/postgres";
import { db } from "@vercel/postgres";

// Add artist name and location info to artist table
export async function addArtistLocation(
  artistName,
  artistBirthplace = null,
  artistOrigin = null
) {
  if (artistBirthplace === null && artistOrigin === null) {
    // This shouldn't happen
    console.log(
      "Tried to add to artist location without a birthplace or origin"
    );
    return;
  }

  try {
    await sql`
      INSERT INTO artist_locations (artist, birthplace, origin)
      VALUES (${artistName}, ${artistBirthplace}, ${artistOrigin});
    `;
  } catch (error) {
    console.error("Error adding artist location:", error);
  }
}

// Retrieve artist location info from artist table
// Returns {artistName: {birthplace: string, origin: string}}
export async function getArtistLocation(artistName) {
  const query = sql`
      SELECT birthplace, origin
      FROM artist_locations
      WHERE artist = ${artistName};
    `;

  let locations = {};
  try {
    let { rows } = await sql`
      SELECT birthplace, origin
      FROM artist_locations
      WHERE artist = ${artistName};
    `;
    const { birthplace, origin } = rows[0];
    locations[artistName] = {
      birthplace: birthplace ? birthplace : null,
      origin: origin ? origin : null,
    };
    return locations;
  } catch (error) {
    locations[artistName] = {
      birthplace: null,
      origin: null,
    };
    return locations;
    console.error("Error retrieving artist location:", error);
  }
}

// Add location coordinates to table
export async function addLocationCoordinates(location, lat, lng) {
  try {
    await sql`
        INSERT INTO location_coordinates (location, lat, lng)
        VALUES (${location}, ${lat}, ${lng});
      `;
  } catch (error) {
    console.error("Error adding location coordinates:", error);
  }
}

// retreive location coordinates from table
// returns {lat: float, lng: float}
export async function getLocationCoordinates(location) {
  try {
    const { rows } = await sql`
      SELECT lat, lng 
      FROM location_coordinates
      WHERE location = ${location};
    `;
    if (rows === undefined || rows == 0) {
      return { lat: null, lng: null };
    }
    const { lat, lng } = rows[0];
    if (lng === null || lat === null) {
      return { lat: null, lng: null };
    }
    return { lat: lat, lng: lng };
  } catch (error) {
    console.error("Error retrieving location coords:", error);
  }
}
// Adds location into Failed Location table, to be manually geocoded
export async function addFailedLocation(location) {
  try {
    await sql`
        INSERT INTO failed_locations (location)
        VALUES (${location});

      `;
  } catch (error) {
    // ignoring duplicates error, impossible to add duplicate
    if (
      !error.message.includes("duplicate key value violates unique constraint")
    ) {
      console.error("Error adding failed location:", error);
    }
  }
}
