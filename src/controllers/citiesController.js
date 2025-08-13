const pollutionService = require("../services/pollutionService");

const getCities = async (req, res) => {
  try {
    const { country = "DE", page, limit } = req.query;
    const data = await pollutionService.fetchPollutionData(
      country,
      Number(page),
      Number(limit)
    );
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCities };
