import { getUsersTopArtists } from "../../lib/spotify";
import { getSession } from "next-auth/react";
import { findArtistLocations } from "../../utils/generateArtistLocations";
import { geocodeLocation } from "../../utils/geocode";

// Get artist list from spotify and return all of the location info
// items: [{artist: {birthplace: {location: string, lat: float, lng: float}, origin: {location: string, lat: float, lng: float}}}]
const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getUsersTopArtists(accessToken);
  const { items } = await response.json();

  let artists = [];
  for (const elem of items) {
    artists.push(elem["name"]);
  }
  const locations = await findArtistLocations(artists);

  return res.status(200).json({ items: locations });
};

export default handler;
