const express = require("express");
const router = express.Router();
const { User } = require("../database")

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error from the users route.");
  }
});

// GET one user
router.get("/:userId", async (req, res) => {
  try {
    const userID = Number(req.params.userId); // fixed
    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error from the user route.");
  }
});

// PATCH user
router.patch("/:userId", async (req, res) => {
  try {
    const user = await User.findByPk(Number(req.params.userId)); // fixed
    if (!user) {
      return res.status(404).send("User not found");
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error from the patch existing user route.");
  }
});

module.exports = router;
