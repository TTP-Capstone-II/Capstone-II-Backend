const express = require('express');
const router = express.Router();
const {Forum, Post, Reply, User} = require('../database')

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
  
  module.exports = router;