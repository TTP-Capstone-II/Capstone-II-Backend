const express = require('express');
const router = express.Router();
const {Simulation, Forum, User} = require('../database');

//GET all simulations from one user
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const simulations = await Simulation.findAll({
            where: { userId },
            include: [{ model: Forum, attributes: ["name"] }],
            order: [["forumId", "ASC"]],
            order: [["createdAt", "DESC"]],
        })
        res.json(simulations);
    } catch (err) {
        console.error("Error fetching simulations", err);
        res.status(500).json({ error: "Failed to get simulations for this user." });
    }
});

module.exports = router;