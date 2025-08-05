const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const forumRouter = require("./forum");

router.use("/test-db", testDbRouter);
router.use("/forum", forumRouter);

module.exports = router;
