// utils/cityFilter.js

function normalizeCityName(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-ząćęłńóśźż\- ]/gi, "")
    .trim();
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

  if (invalidKeywords.some((kw) => name.includes(kw))) return false;

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

  const uniqueCities = Object.values(
    normalized.reduce((acc, entry) => {
      if (!acc[entry.name] || acc[entry.name].pollution < entry.pollution) {
        acc[entry.name] = entry;
      }
      return acc;
    }, {})
  );

  return uniqueCities;
}

module.exports = { normalizeAndFilterCities };
