const express = require('express');
const router = express.Router();
const {Forum, Post, Reply, User} = require('../database');

//Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error from the get all posts route");
    }
});

//Get a specific post
router.get("/:id", async (req, res) => {
    try {
        const postID = Number(req.params.id);
        console.log(postID);
        const post = await Post.findByPk(postID);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error from the get single post route");
    }
});

router.delete("/:postId", async (req, res) => {
    try{
        const post = await Post.findByPk(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        await post.destroy();
        res.status(200).send("Post deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error from the delete existing post route");
    }
});

//POST a reply
router.post("/:postId/reply/", async (req, res) => {
    const {postId} = req.params;
    try {
        const { content, userId, postId, likes = 0 } = req.body;
        const newReply = await Reply.create({
            content,
            userId, 
            postId: postId,
            likes,
        });

        res.status(201).json(newReply);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error from the post new reply route");
    }
})

module.exports = router;