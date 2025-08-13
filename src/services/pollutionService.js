const axiosInstance = require("../api/axiosInstance");
const { normalizeAndFilterCities } = require("../utils/cityFilter");
const { enrichWithWikiDescriptions } = require("./wikiService");

async function fetchPollutionData(country, page = 1, limit = 50) {
  if (!country) {
    throw new Error("Country code is required");
  }

  try {
    // Fetch pollution data
    const res = await axiosInstance.get("/pollution", {
      params: {
        country,
        page,
        limit,
      },
    });

    // Normalize and filter cities
    const filteredCities = normalizeAndFilterCities(res.data.results);

    // Enrich with Wikipedia descriptions
    const enrichedCities = await enrichWithWikiDescriptions(filteredCities);

    // Return response in the original format
    return {
      meta: res.data.meta,
      results: enrichedCities,
    };
  } catch (error) {
    throw new Error(`Failed to fetch pollution data: ${error.message}`);
  }
}

module.exports = { fetchPollutionData };
