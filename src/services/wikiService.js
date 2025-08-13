const axios = require("axios");
const API_DELAY_MS = 200;
const NO_DESC = "No description available";

const wikiCache = new Map();

const findWikipediaTitle = async (city) => {
  try {
    const { data } = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        city
      )}&format=json`
    );
    return data?.query?.search?.[0]?.title ?? null;
  } catch (err) {
    console.error(`Search API failed for ${city}:`, err.message);
    return null;
  }
};

const fetchWikiData = async (city) => {
  if (wikiCache.has(city)) return wikiCache.get(city);

  try {
    const title = await findWikipediaTitle(city);
    if (!title)
      return wikiCache
        .set(city, { title: null, description: NO_DESC })
        .get(city);

    const { data } = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`
    );

    return wikiCache
      .set(city, { title, description: data.extract || NO_DESC })
      .get(city);
  } catch (err) {
    if (err.response?.status === 404) {
      return wikiCache
        .set(city, { title: null, description: NO_DESC })
        .get(city);
    }
    throw new Error(`Failed to fetch description for ${city}: ${err.message}`);
  }
};

const enrichWithWikiDescriptions = async (cities) => {
  const enriched = await Promise.all(
    cities.map(async (city) => {
      await new Promise((res) => setTimeout(res, API_DELAY_MS));
      const wikiData = await fetchWikiData(city.name);
      return {
        ...city,
        description: wikiData.description,
      };
    })
  );

  // Deduplicate by wikiTitle (case-insensitive)
  const seen = new Set();
  return enriched.filter((c) => {
    const key = (c.wikiTitle || c.name).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

module.exports = { enrichWithWikiDescriptions };
