import {
  addArtistLocation,
  getArtistLocation,
  addLocationCoordinates,
  getLocationCoordinates,
} from "../database/db.js";
import { geocodeLocation } from "./geocode.js";
import { findArtistLocationsScrape } from "./scrapeLocations.js";

// Takes list of artist strings. For each artist finds location through scraping or database,
// then geocodes location through geocoding api or database
// returns a list of {artist {birthplace, origin}}
export async function findArtistLocations(artists) {
  const artistLocationsPromises = artists.map(async (artist) => {
    const artistLoc = await getArtistLocation(artist);

    if (
      artistLoc[artist].birthplace !== null ||
      artistLoc[artist].origin !== null
    ) {
      return artistLoc;
    } else {
      const scrapedLocation = await findArtistLocationsScrape(artist);
      if (scrapedLocation.birthplace || scrapedLocation.origin) {
        await addArtistLocation(
          artist,
          scrapedLocation.birthplace,
          scrapedLocation.origin
        );
      }
      return {
        [artist]: {
          birthplace: scrapedLocation.birthplace,
          origin: scrapedLocation.origin,
        },
      };
    }
  });

  const artistLocations = await Promise.all(artistLocationsPromises);
  return findLocationCoordinates(artistLocations);
}

// Finds coordinates for artist locations
// takes list of {artist {birthplace, origin}},
// returns list of {artist {birthplace: {name, lat, lng}, origin: {lat, lng}}}
// TODO simplify by just geocoding locations without the whole artist map
async function findLocationCoordinates(artistLocations) {
  const resultPromises = artistLocations.map((item) => {
    const entries = Object.entries(item).map(async ([key, value]) => {
      const convertedValue = await Promise.all(
        Object.entries(value).map(async ([subKey, location]) => {
          if (location) {
            let coordinates = await getLocationCoordinates(location);
            if (coordinates.lat === null && coordinates.lng === null) {
              coordinates = await geocodeLocation(location);
              if (coordinates.lat && coordinates.lng) {
                await addLocationCoordinates(
                  location,
                  coordinates.lat,
                  coordinates.lng
                );
              }
            }
            return { [subKey]: { location, ...coordinates } };
          } else {
            return { [subKey]: { location: null, lat: null, lng: null } };
          }
        })
      );
      return { [key]: Object.assign({}, ...convertedValue) };
    });
    return Promise.all(entries).then((entry) => Object.assign({}, ...entry));
  });

  const results = await Promise.all(resultPromises);
  return results;
}
