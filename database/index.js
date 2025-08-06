const db = require("./db");
const User = require("./models/user");
const Post = require("./models/post");
const Reply = require("./models/reply");
const Forum = require("./models/forum");
const Postlikes = require("./models/postlikes");
const Replylikes = require("./models/replylikes");

// Associations
Forum.hasMany(Post, { foreignKey: "forumId" }); // A forum can have many posts

Post.belongsTo(Forum, { foreignKey: "forumId" }); // A post belongs to a forum

Post.belongsTo(User, { foreignKey: "userId" }); // A post belongs to a user

Post.hasMany(Reply, { foreignKey: "postId" }); // A post can have many replies

Reply.belongsTo(Post, { foreignKey: "postId" }); // A reply belongs to a post

Reply.belongsTo(User, { foreignKey: "userId" }); // A reply belongs to a user

Reply.belongsTo(Reply, { foreignKey: "parentId", as: "parentReply" }); // A reply can have a parent reply

Reply.hasMany(Reply, { foreignKey: "parentId", as: "childReplies" }); // A reply can have many child replies

// Post <-> User likes
User.belongsToMany(Post, {
  through: Postlikes,
  foreignKey: "userId",
  otherKey: "postId",
  as: "likedPosts",
});
Post.belongsToMany(User, {
  through: Postlikes,
  foreignKey: "postId",
  otherKey: "userId",
  as: "likedByUsers",
});

// Reply <-> User likes
User.belongsToMany(Reply, {
  through: Replylikes,
  foreignKey: "userId",
  otherKey: "replyId",
  as: "likedReplies",
});
Reply.belongsToMany(User, {
  through: Replylikes,
  foreignKey: "replyId",
  otherKey: "userId",
  as: "likedByUsers",
});

module.exports = {
  db,
  User,
  Post,
  Forum,
  Reply,
  Postlikes,
  Replylikes,
};
