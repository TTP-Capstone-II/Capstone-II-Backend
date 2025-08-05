const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const forumRouter = require("./forum");
const postRouter = require("./post");

router.use("/test-db", testDbRouter);
router.use("/forum", forumRouter);
router.use("/post", postRouter);

module.exports = router;
