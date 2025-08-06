const express = require("express");
const router = express.Router();
const { Replylikes, Reply } = require("../database");

// Check if the user has liked a specific reply
router.get("/:replyId/likes/:userId", async (req, res) => {
  try {
    const { replyId, userId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    if (!replyId || isNaN(replyId)) {
      return res.status(400).json({ error: "Invalid reply ID." });
    }

    const like = await Replylikes.findOne({ where: { replyId, userId } });

    return res.status(200).json({ liked: !!like });
  } catch (error) {
    console.error("Error checking reply like:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Like a reply
router.post("/:replyId/like/:userId", async (req, res) => {
  const { replyId, userId } = req.params;

  try {
    const existing = await Replylikes.findOne({ where: { userId, replyId } });
    if (existing) {
      return res.status(400).json({ error: "You already liked this reply" });
    }

    await Replylikes.create({ userId, replyId });

    // Optional: increment reply.likes
    await Reply.increment("likes", { where: { id: replyId } });

    res.status(201).json({ message: "Reply liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like reply" });
  }
});

// Unlike a reply
router.delete("/:replyId/unlike/:userId", async (req, res) => {
  const { replyId, userId } = req.params;

  try {
    const deleted = await Replylikes.destroy({ where: { userId, replyId } });

    if (!deleted) {
      return res.status(404).json({ error: "Like not found" });
    }

    // Optional: decrement reply.likes
    await Reply.decrement("likes", { where: { id: replyId } });

    res.status(200).json({ message: "Reply unliked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unlike reply" });
  }
});

module.exports = router;
