const express = require("express");
const router = express.Router();
const { Simulation, Forum, User } = require("../database");

//Get one simulation from a user
router.get("/savedSims/:simId", async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.simId);

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found." });
    }

    res.json({
      ...simulation.toJSON(),
      storedValues: JSON.parse(simulation.storedValues),
    });
  } catch (err) {
    console.error("Error fetching simulation", err);
    res.status(500).json({ error: "Failed to fetch simulation." });
  }
});

//GET all simulations from one user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const simulations = await Simulation.findAll({
      where: { userId },
      include: [{ model: Forum, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    // Convert storedValues string → object
    const parsedSimulations = simulations.map((sim) => ({
      ...sim.toJSON(),
      storedValues: JSON.parse(sim.storedValues),
    }));

    res.json(parsedSimulations);
  } catch (err) {
    console.error("Error fetching simulations", err);
    res.status(500).json({ error: "Failed to get simulations for this user." });
  }
});

//POST create a new simulation
router.post("/", async (req, res) => {
  try {
    const { userId, forumId, storedValues } = req.body;

    const simulation = await Simulation.create({
      userId,
      forumId,
      storedValues: JSON.stringify(storedValues),
    });

    res.status(201).json({
      ...simulation.toJSON(),
      storedValues: JSON.parse(simulation.storedValues),
    });
  } catch (err) {
    console.error("Error creating simulation", err);
    res.status(500).json({ error: "Failed to create simulation." });
  }
});

// PATCH - update simulation
router.patch("/:simId", async (req, res) => {
  try {
    const { storedValues, ...otherFields } = req.body;
    const simulation = await Simulation.findByPk(req.params.simId);

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found." });
    }

    // Update a saved existing simulation
    if (storedValues !== undefined) {
      simulation.storedValues = JSON.stringify(storedValues);
    }
    Object.assign(simulation, otherFields);

    await simulation.save();

    res.json({
      ...simulation.toJSON(),
      storedValues: JSON.parse(simulation.storedValues),
    });
  } catch (err) {
    console.error("Error updating simulation", err);
    res.status(500).json({ error: "Failed to update simulation." });
  }
});

// DELETE - delete existing simulation
router.delete("/:simId", async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.simId);
    if (!simulation) {
      return res.status(404).send("Simulation not found");
    }

    await simulation.destroy();
    res.status(200).send("Simulation deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error from the delete existing simulation route");
  }
});

module.exports = router;
