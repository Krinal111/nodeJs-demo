const axios = require("axios");
const wikiCache = new Map();
const API_DELAY_MS = 200;
async function fetchWikiDescription(cityName) {
  if (wikiCache.has(cityName)) {
    return wikiCache.get(cityName);
  }

  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        cityName
      )}`
    );
    const description = response.data.extract || "No description available";

    // Store in cache
    wikiCache.set(cityName, description);
    return description;
  } catch (error) {
    if (error.response?.status === 404) {
      wikiCache.set(cityName, "No description available");
      return "No description available";
    }
    throw new Error(
      `Failed to fetch description for ${cityName}: ${error.message}`
    );
  }
}

async function enrichWithWikiDescriptions(cities) {
  const enrichedCities = [];

  for (const city of cities) {
    // Introduce delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

    const description = await fetchWikiDescription(city.name);
    enrichedCities.push({
      ...city,
      description,
    });
  }

  return enrichedCities;
}

module.exports = { enrichWithWikiDescriptions };
