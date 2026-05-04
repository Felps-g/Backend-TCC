async function getTopPlayersByPointsController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const data = await statsService.getTopPlayersByPoints(limit);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTopPlayersByEfficiencyController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const data = await statsService.getTopPlayersByEfficiency(limit);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}