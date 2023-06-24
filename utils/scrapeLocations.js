const unirest = require("unirest");
const cheerio = require("cheerio");

// Scrapes wikipedia for artists birthpalce and/or origin locations
// returns {origin: string, location: string}
export async function findArtistLocationsScrape(artist) {
  // Find the locations of the artists by searching wikipedia
  const locationMap = {};
  let data = await unirest
    .get(`https://en.wikipedia.org/wiki/${artist}`)
    .header("Accept", "text/html");
  const $ = cheerio.load(data.body);
  $("th.infobox-label").each(function (i, elem) {
    const born = $(elem).text();
    if (born == "Origin") {
      locationMap.origin = $(elem).nextUntil("infobox-data").text().trim();
      return;
    } else if (born == "Born") {
      locationMap.birthplace = $(elem).nextUntil("infobox-data").text().trim();
      return;
    }
  });

  if (locationMap.hasOwnProperty("birthplace")) {
    locationMap.birthplace = wikiDataCleaner(locationMap.birthplace);
  }

  if (locationMap.hasOwnProperty("origin")) {
    locationMap.origin = wikiDataCleaner(locationMap.origin);
  }

  return locationMap;
}

// Clean data taken from wikipedia
function wikiDataCleaner(rawLocation) {
  const regex = /\([^()]+\)([^()]+)$/;

  const match = rawLocation.match(regex);

  // if location data is already clean, don't do anything!
  let cleanLocation = match ? match[1].trim() : rawLocation;

  // Handle wikipedia data edgecase
  if (cleanLocation.includes("[") || cleanLocation.includes("]")) {
    const regex = /\[\d+\]/g;
    cleanLocation = cleanLocation.replace(regex, "");
    const result = cleanLocation.replace(/\./g, "");
    return result;
  } else {
    const result = cleanLocation.replace(/\./g, "");
    return result;
  }
}
