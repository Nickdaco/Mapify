import {
  addArtistLocation,
  getArtistLocation,
  addLocationCoordinates,
  getLocationCoordinates,
  addFailedLocation,
} from "../database/db.js";
import { geocodeLocation } from "./geocode.js";
import { findArtistLocationsScrape } from "./scrapeLocations.js";

// Takes list of artist strings. For each artist finds location through scraping or database,
// then geocodes location through geocoding api or database
// returns a list of {artist {birthplace, origin}}
export async function findArtistLocations(artists) {
  const artistLocations = [];
  for (const artist of artists) {
    const artistLoc = await getArtistLocation(artist);

    // if artist's in the db, skip scraping and get locations
    if (
      artistLoc[artist].birthplace !== null ||
      artistLoc[artist].origin !== null
    ) {
      artistLocations.push(artistLoc);
    } else {
      const scrapedLocation = await findArtistLocationsScrape(artist);
      if (scrapedLocation.birthplace || scrapedLocation.origin) {
        addArtistLocation(
          artist,
          scrapedLocation.birthplace,
          scrapedLocation.origin
        );
      }
      let out = {};
      out[artist] = {
        birthplace: scrapedLocation.birthplace,
        origin: scrapedLocation.origin,
      };

      artistLocations.push(out);
    }
  }

  return findLocationCoordinates(artistLocations);
}

// Finds coordinates for artist locations
// takes list of {artist {birthplace, origin}},
// returns list of {artist {birthplace: {name, lat, lng}, origin: {lat, lng}}}
// TODO simplify by just geocoding locations without the whole artist map
async function findLocationCoordinates(artistLocations) {
  const result = [];

  for (const item of artistLocations) {
    const convertedItem = {};

    for (const [key, value] of Object.entries(item)) {
      const convertedValue = {};
      for (const [subKey, location] of Object.entries(value)) {
        if (location) {
          let coordinates = await getLocationCoordinates(location);
          if (coordinates.lat === null && coordinates.lng === null) {
            coordinates = await geocodeLocation(location);
            if (coordinates.lat && coordinates.lng) {
              addLocationCoordinates(
                location,
                coordinates.lat,
                coordinates.lng
              );
            }
          }
          convertedValue[subKey] = { location, ...coordinates };
        } else {
          convertedValue[subKey] = { location: null, lat: null, lng: null };
        }
      }

      convertedItem[key] = convertedValue;
    }

    result.push(convertedItem);
  }
  return result;
}
