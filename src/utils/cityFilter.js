// utils/cityFilter.js

function normalizeCityName(name) {
  return (
    name
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      // .replace(/[^a-ząćęłńóśźż\- ]/gi, "")
      .trim()
  );
}

function isValidCityName(name) {
  const invalidKeywords = [
    "station",
    "district",
    "zone",
    "area",
    "powerplant",
    "industrial",
    "monitoring",
    "unknown",
    "point",
    "alpha",
  ];

  if (/\d/.test(name)) return false;

  if (invalidKeywords.some((keyword) => name.includes(keyword))) return false;

  if (name.length < 2) return false;

  return true;
}

function normalizeAndFilterCities(results) {
  const normalized = results
    .map((entry) => ({
      name: normalizeCityName(entry.name),
      pollution: entry.pollution,
    }))
    .filter((entry) => isValidCityName(entry.name));

  return normalized;
}

module.exports = { normalizeAndFilterCities };
