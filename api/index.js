const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const forumRouter = require("./forum");
const postRouter = require("./post");
const postLikesRouter = require("./postlikes");
const replyLikesRouter = require("./replylikes");
const simulationRouter = require("./simulation");
const userRouter = require("./users");

router.use("/test-db", testDbRouter);
router.use("/forum", forumRouter);
router.use("/post", postRouter);
router.use("/postlikes", postLikesRouter);
router.use("/replylikes", replyLikesRouter);
router.use("/simulation", simulationRouter);
router.use("/users", userRouter);


module.exports = router;
