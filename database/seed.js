const db = require("./db");
const { User } = require("./index");
const { Post } = require("./index");
const { Reply } = require("./index");
const { Forum } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    // Users
    const users = await User.bulkCreate([
      { username: 'hailia', passwordHash: User.hashPassword('hai123'), email: 'hailia@example.com' },
      { username: 'alex', passwordHash: User.hashPassword('alex123'), email: 'alex@example.com' },
    ], { returning: true });

    const [hailia, alex] = users;

    // Forums
    const forums = await Forum.bulkCreate([
      { name: 'Projectile Motion' },
      { name: 'Friction' },
    ], { returning: true });

    const [projectileForum, frictionForum] = forums;

    // Posts
    const posts = await Post.bulkCreate([
      {
        title: 'How to calculate max height?',
        content: 'I’m confused about which formula to use when given initial velocity and angle.',
        forumId: projectileForum.id,
        userId: hailia.id,
      },
      {
        title: 'How to calculate max width?',
        content: 'Idk bro physics is hard',
        forumId: projectileForum.id,
        userId: hailia.id,
      },
      {
        title: 'Static vs kinetic friction',
        content: 'When does static friction switch to kinetic friction? Is it instantaneous?',
        forumId: frictionForum.id,
        userId: alex.id,
      },
    ], { returning: true });

    const [post1, post2] = posts;

    // Replies
    const replies = await Reply.bulkCreate([
      {
        content: 'Use v² = v₀² - 2g(y - y₀), or break velocity into vertical component!',
        postId: post1.id,
        userId: alex.id,
      },
      {
        content: 'Ah, so I should use v₀y = v₀ * sin(θ)?',
        postId: post1.id,
        userId: hailia.id,
        parentId: 1, // be cautious with hardcoding IDs if running multiple times
      },
      {
        content: 'Yes — and kinetic friction kicks in once the object is moving.',
        postId: post2.id,
        userId: hailia.id,
      },
    ]);


    // Create more seed data here once you've created your models
    // Seed files are a great way to test your database schema!

    console.log("🌱 Seeded the database");
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error.message.includes("does not exist")) {
      console.log("\n🤔🤔🤔 Have you created your database??? 🤔🤔🤔");
    }
  }
  db.close();
};

seed();
