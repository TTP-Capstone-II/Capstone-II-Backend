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

//Create a new post in a forum
router.post('/:forumId/post/', async(req, res) => {
  const { forumId } = req.params;
  try {
    const { title, content, userId, likes = 0 } = req.body;
    const newPost = await Post.create({
      title,
      content,
      likes,
      userId,
      forumId: forumId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error from the post new post route");
  }
});

  module.exports = router;