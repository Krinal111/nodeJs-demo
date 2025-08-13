

const axios = require("axios");
const API_DELAY_MS = 200;

let wikiCache = [];

async function findWikipediaTitle(cityName) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cityName
    )}&format=json`;
    const { data } = await axios.get(searchUrl);
    return data?.query?.search?.[0]?.title ?? null;
  } catch (error) {
    console.error(`Search API failed for ${cityName}:`, error.message);
    return null;
  }
}

async function fetchWikiDescription(cityName) {
  const cached = wikiCache.find(([name]) => name === cityName);
  if (cached) return cached[1];

  try {
    const bestTitle = await findWikipediaTitle(cityName);
    if (!bestTitle) {
      wikiCache = [...wikiCache, [cityName, "No description available"]];
      return "No description available";
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      bestTitle
    )}`;
    const { data } = await axios.get(summaryUrl);
    const description = data.extract || "No description available";

    wikiCache = [...wikiCache, [cityName, description]];
    return description;
  } catch (error) {
    if (error.response?.status === 404) {
      wikiCache = [...wikiCache, [cityName, "No description available"]];
      return "No description available";
    }
    throw new Error(
      `Failed to fetch description for ${cityName}: ${error.message}`
    );
  }
}

async function enrichWithWikiDescriptions(cities) {
  return Promise.all(
    cities.map(async (city) => {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
      const description = await fetchWikiDescription(city.name);
      return { ...city, description };
    })
  );
}

module.exports = { enrichWithWikiDescriptions };
