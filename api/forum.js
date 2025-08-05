const express = require('express');
const router = express.Router();
const {Forum, Post, Reply, User} = require('../database')

// Get posts for a specific forum

router.get('/:forumId/posts', async (req, res) => {
    const { forumId } = req.params;
    console.log(`Fetching posts for forum ID: ${forumId}`);
    try {
      const posts = await Post.findAll({
        where: { forumId },
        include: [{ model: User, attributes: ['username'] }],
        order: [['createdAt', 'DESC']],
      });
      res.json(posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ error: 'Failed to fetch posts for this forum.' });
    }
  });

  // Get all forums

  router.get('/', async (req, res) => {
    try {
      const forums = await Forum.findAll();
      res.json(forums);
    } catch (err) {
      console.error('Error fetching forums:', err);
      res.status(500).json({ error: 'Failed to fetch forums.' });
    }
  });
  
  module.exports = router;