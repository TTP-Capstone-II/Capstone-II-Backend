const db = require("./db");
const User = require("./models/user");
const Post = require("./models/post");
const Reply = require("./models/reply");
const Forum = require("./models/forum");


// Associations
Forum.hasMany(Post, { foreignKey: "forumId" }); // A forum can have many posts

Post.belongsTo(Forum, { foreignKey: "forumId" }); // A post belongs to a forum

Post.belongsTo(User, { foreignKey: "userId" }); // A post belongs to a user

Post.hasMany(Reply, { foreignKey: "postId" }); // A post can have many replies

Reply.belongsTo(Post, { foreignKey: "postId" }); // A reply belongs to a post

Reply.belongsTo(User, { foreignKey: "userId" }); // A reply belongs to a user

Reply.belongsTo(Reply, { foreignKey: "parentId", as: "parentReply" }); // A reply can have a parent reply

Reply.hasMany(Reply, { foreignKey: "parentId", as: "childReplies" }); // A reply can have many child replies



module.exports = {
  db,
  User,
  Post,
  Forum,
  Reply,
};
