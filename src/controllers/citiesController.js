const pollutionService = require("../services/pollutionService");

exports.getCities = async (req, res) => {
  try {
    const data = await pollutionService.fetchPollutionData("PL", 1, 50);
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error });
  }
};
