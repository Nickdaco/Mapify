const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database/data.db",
  },
  useNullAsDefault: true,
});

module.exports = knex;

// Add artist name and location info to artist table
async function addArtistLocation(
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
    const newArtistLocation = await knex("artist_locations").insert({
      artist: artistName,
      birthplace: artistBirthplace,
      origin: artistOrigin,
    });
    return newArtistLocation;
  } catch (error) {
    console.error("Error adding artist location:", error);
    throw error;
  }
}

// Retrieve artist location info from artist table
// Returns {artistName: {birthplace: string, origin: string}}
async function getArtistLocation(artistName) {
  try {
    const artistInfo = await knex("artist_locations")
      .select("birthplace", "origin")
      .where("artist", artistName)
      .first();

    let locations = {};

    locations[artistName] = {
      birthplace: artistInfo ? artistInfo.birthplace : null,
      origin: artistInfo ? artistInfo.origin : null,
    };

    return locations;
  } catch (error) {
    console.error("Error retrieving artist information:", error);
    throw error;
  }
}

// Add location coordinates to table
async function addLocationCoordinates(location, lat, lng) {
  try {
    const newArtistLocation = await knex("location_coordinates").insert({
      location: location,
      lat,
      lng,
    });
    return newArtistLocation;
  } catch (error) {
    console.error("Error adding artist location:", error);
    throw error;
  }
}

// retreive location coordinates from table
// returns {lat: float, lng: float}
async function getLocationCoordinates(location) {
  try {
    const locationCoordinates = await knex("location_coordinates")
      .select("lat", "lng")
      .where("location", location)
      .first();
    if (!locationCoordinates) {
      // Handle the case where the location coordinates are not found
      return { lat: null, lng: null }; // Or return a default value
    }
    return { lat: locationCoordinates.lat, lng: locationCoordinates.lng };
  } catch (error) {
    console.error("Error retrieving location coordinates:", error);
    throw error;
  }
}

// Adds location into Failed Location table, to be manually geocoded
async function addFailedLocation(location) {
  try {
    const newFailedLocation = await knex("failed_locations").insert({
      location: location,
    });
    return newFailedLocation;
  } catch (error) {
    console.error("Error adding failed location to table:", error);
    throw error;
  }
}

// TODO: Add removeFromFailedLocation and inFailedLocation

module.exports = {
  addArtistLocation,
  getArtistLocation,
  addLocationCoordinates,
  getLocationCoordinates,
  addFailedLocation,
};
