const db = require("./db");
const { User } = require("./index");
const { Post } = require("./index");
const { Reply } = require("./index");
const { Forum } = require("./index");
const { Postlikes } = require("./index");
const { Replylikes } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

      // USERS
      const users = await User.bulkCreate([
        { username: "hailia", passwordHash: User.hashPassword("hai123"), email: "hailia@example.com" },
        { username: "alex", passwordHash: User.hashPassword("alex123"), email: "alex@example.com" },
        { username: "phone", passwordHash: User.hashPassword("phone123"), email: "phone@example.com" },
        { username: "darrel", passwordHash: User.hashPassword("darrel123"), email: "darrel@example.com" },
      ], { returning: true });
  
      const [hailia, alex, phone, darrel] = users;
  
      // FORUMS
      const forums = await Forum.bulkCreate([
        { name: "Projectile Motion" },
        { name: "Friction" },
        { name: "Free Fall" },
        { name: "Torque" },
        { name: "Inertia" },
      ], { returning: true });
  
      const [projectileForum, frictionForum, freeFallForum, torqueForum, inertiaForum] = forums;
  
      // POSTS
      const posts = await Post.bulkCreate([
        {
          title: "How to calculate max height?",
          content: "I’m confused about which formula to use when given initial velocity and angle.",
          forumId: projectileForum.id,
          userId: hailia.id,
        },
        {
          title: "How to calculate max width?",
          content: "Idk bro physics is hard",
          forumId: projectileForum.id,
          userId: hailia.id,
        },
        {
          title: "Static vs kinetic friction",
          content: "When does static friction switch to kinetic friction? Is it instantaneous?",
          forumId: frictionForum.id,
          userId: alex.id,
        },
        {
          title: "Does mass affect fall speed?",
          content: "If I drop a feather and a rock, why don’t they fall the same?",
          forumId: freeFallForum.id,
          userId: phone.id,
        },
        {
          title: "What exactly is torque?",
          content: "I don’t understand torque — is it just force but twisty?",
          forumId: torqueForum.id,
          userId: darrel.id,
        },
        {
          title: "How does inertia work?",
          content: "Why do objects in motion stay in motion? Magic?",
          forumId: inertiaForum.id,
          userId: alex.id,
        },
      ], { returning: true });
  
      const [post1, post2, post3, post4, post5, post6] = posts;
  
      // REPLIES
      const replies = await Reply.bulkCreate([
        // Projectile Motion
        {
          content: "Use v² = v₀² - 2g(y - y₀), or break velocity into vertical component!",
          postId: post1.id,
          userId: alex.id,
        },
        {
          content: "Ah, so I should use v₀y = v₀ * sin(θ)?",
          postId: post1.id,
          userId: hailia.id,
          parentId: 1,
        },
        {
          content: "Yes, that’s it! Then solve for y using kinematic equations.",
          postId: post1.id,
          userId: phone.id,
          parentId: 2,
        },
  
        // Friction
        {
          content: "Yes — and kinetic friction kicks in once the object is moving.",
          postId: post3.id,
          userId: hailia.id,
        },
        {
          content: "Static friction can vary but maxes out. Once exceeded, motion begins.",
          postId: post3.id,
          userId: darrel.id,
        },
  
        // Free Fall
        {
          content: "Air resistance slows the feather down. In a vacuum, they'd fall together.",
          postId: post4.id,
          userId: alex.id,
        },
        {
          content: "Try looking up the Galileo drop test!",
          postId: post4.id,
          userId: hailia.id,
          parentId: 6,
        },
  
        // Torque
        {
          content: "Torque = force × distance from pivot point. Think of a wrench.",
          postId: post5.id,
          userId: phone.id,
        },
        {
          content: "So the longer the lever, the more torque?",
          postId: post5.id,
          userId: darrel.id,
          parentId: 8,
        },
  
        // Inertia
        {
          content: "It's Newton’s 1st Law — no magic, just physics!",
          postId: post6.id,
          userId: hailia.id,
        },
        {
          content: "Inertia resists changes in motion. Mass affects it.",
          postId: post6.id,
          userId: alex.id,
        },
      ]);

    //Postlikes
    const postlikes = await Postlikes.bulkCreate([
      {
        postId: post1.id,
        userId: alex.id,
      },
      {
        postId: post2.id,
        userId: hailia.id,
      },
    ]);

    //Replylikes
    const replylikes = await Replylikes.bulkCreate([
      {
        replyId: 1,
        userId: alex.id,
      },
      {
        replyId: 2,
        userId: hailia.id,
      }
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
