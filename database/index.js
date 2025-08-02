const db = require("./db");
const User = require("./user");
const Thread = require("./thread");
const Reply = require("./reply");
const Like = require("./like");

// Associations
User.hasMany(Thread, { foreignKey: "userId" }); // A user can have many threads

Thread.belongsTo(User, { foreignKey: "userId" }); // A thread belongs to a user

Thread.hasMany(Reply, { foreignKey: "threadId" }); // A thread can have many replies

Reply.belongsTo(Thread, { foreignKey: "threadId" }); // A reply belongs to a thread

User.belongsToMany(Thread, {
  through: Like,
  foreignKey: "userId",
  otherKey: "threadId",
}); // A user can like many threads

Thread.belongsToMany(User, {
  through: Like,
  foreignKey: "threadId",
  otherKey: "userId",
}); // A thread can be liked by many users

module.exports = {
  db,
  User,
  Thread,
  Reply,
  Like,
};
