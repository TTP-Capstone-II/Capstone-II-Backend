const express = require("express");
const router = express.Router();
const { PostLike, Post, User } = require("../database");

// Check if the user has liked a specific post
router.get('/:postId/likes/:userId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const userId = req.params.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID.' });
    }

    const like = await PostLike.findOne({ where: { postId, userId } });

    return res.status(200).json({ liked: !!like });

  } catch (error) {
    console.error('Error checking post like:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});



// Like a post
router.post("/:postId/like/:userId", async (req, res) => {
  const userId = req.params.userId; 
  const postId = Number(req.params.postId);

  try {
    const existing = await PostLike.findOne({ where: { userId, postId } });
    if (existing) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    await PostLike.create({ userId, postId });

    // Increment post.likes count
    await Post.increment("likes", { where: { id: postId } });

    res.status(201).json({ message: "Post liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// Unlike a post
router.delete("/:postId/unlike/:userId", async (req, res) => {
  const userId = req.params.userId;
  const postId = Number(req.params.postId);

  try {
    const deleted = await PostLike.destroy({ where: { userId, postId } });

    if (!deleted) {
      return res.status(404).json({ error: "Like not found" });
    }

    // Decrement post.likes count
    await Post.decrement("likes", { where: { id: postId } });

    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unlike post" });
  }
});

module.exports = router;
