const db = require("./db");
const { User } = require("./index");
const { Post } = require("./index");
const { Reply } = require("./index");
const { Forum } = require("./index");
const { Postlikes } = require("./index");
const { Replylikes } = require("./index");
const { Simulation } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    // USERS
    const users = await User.bulkCreate(
      [
        {
          username: "hailia",
          passwordHash: User.hashPassword("hai123"),
          email: "hailia@example.com",
        },
        {
          username: "alex",
          passwordHash: User.hashPassword("alex123"),
          email: "alex@example.com",
        },
        {
          username: "phone",
          passwordHash: User.hashPassword("phone123"),
          email: "phone@example.com",
        },
        {
          username: "darrel",
          passwordHash: User.hashPassword("darrel123"),
          email: "darrel@example.com",
        },
      ],
      { returning: true }
    );

    const [hailia, alex, phone, darrel] = users;

    // FORUMS
    const forums = await Forum.bulkCreate(
      [
        { name: "Projectile Motion", description: "Discussions about scenarios where an object moves in a bilaterally symmetrical, parabolic path." },
        { name: "Friction", description: "Discussions about scenarios where the force that resists the relative motion of solid surfaces, fluid layers, and material elements are sliding against each other." },
        { name: "Free Fall", description: "Discussions about scenarios where any motion of an object where gravity is the only force acting upon it.." },
        { name: "Torque", description: "Discussions about scenarios where rotational force applied to an object causes it to rotate around an axis." },
        { name: "Inertia", description: "Discussions about scenarios where an object resists changes to its current state of motion." },
      ],
      { returning: true }
    );

    const [
      projectileForum,
      frictionForum,
      freeFallForum,
      torqueForum,
      inertiaForum,
    ] = forums;

    // POSTS
    const posts = await Post.bulkCreate(
      [
        {
          title: "How to calculate max height?",
          content:
            "I’m confused about which formula to use when given initial velocity and angle.",
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
          content:
            "When does static friction switch to kinetic friction? Is it instantaneous?",
          forumId: frictionForum.id,
          userId: alex.id,
        },
        {
          title: "Does mass affect fall speed?",
          content:
            "If I drop a feather and a rock, why don’t they fall the same?",
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
      ],
      { returning: true }
    );

    const [post1, post2, post3, post4, post5, post6] = posts;

    const forumUpdate = await Forum.findAll();
    for (const forum of forumUpdate) {
      const count = await Post.count({ where: { forumId: forum.id } });
      await forum.update({ numOfPosts: count });
    }

    // REPLIES
    const replies = await Reply.bulkCreate([
      // Projectile Motion
      {
        content:
          "Use v² = v₀² - 2g(y - y₀), or break velocity into vertical component!",
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
        content:
          "Yes — and kinetic friction kicks in once the object is moving.",
        postId: post3.id,
        userId: hailia.id,
      },
      {
        content:
          "Static friction can vary but maxes out. Once exceeded, motion begins.",
        postId: post3.id,
        userId: darrel.id,
      },

      // Free Fall
      {
        content:
          "Air resistance slows the feather down. In a vacuum, they'd fall together.",
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
        content:
          "Torque = force × distance from pivot point. Think of a wrench.",
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
      {
        postId: post2.id,
        userId: darrel.id,
      },
    ]);

    const postUpdate = await Post.findAll();
    for (const post of postUpdate) {
      const count = await Postlikes.count({ where: { postId: post.id } });
      await post.update({ likes: count });
    }

    //Replylikes
    const replylikes = await Replylikes.bulkCreate([
      {
        replyId: 1,
        userId: alex.id,
      },
      {
        replyId: 2,
        userId: hailia.id,
      },
      {
        replyId: 1,
        userId: hailia.id,
      },
    ]);

    const replyUpdate = await Reply.findAll();
    for (const reply of replyUpdate) {
      const count = await Replylikes.count({ where: { replyId: reply.id } });
      await reply.update({ likes: count });
    }

    //Simulation
    const simulation = await Simulation.bulkCreate([
      {
        userId: darrel.id,
        forumId: inertiaForum.id,
        storedValues: JSON.stringify({
          simulationName: "Inertia Test 1",
          objects: [
            { id: 1, type: "block", mass: 5, velocity: 2, friction: 0.1 },
            { id: 2, type: "sphere", mass: 3, velocity: 0, friction: 0.05 },
          ],
          environment: { gravity: 9.81, airResistance: false },
          settings: { timeStep: 0.016, duration: 10 },
        }),
      },
      {
        userId: darrel.id,
        forumId: inertiaForum.id,
        storedValues: JSON.stringify({
          simulationName: "Inertia Ramp Test",
          objects: [
            { id: 1, type: "cart", mass: 4, velocity: 5, angle: 15 },
            { id: 2, type: "block", mass: 2, velocity: 0 },
          ],
          environment: { gravity: 9.81, airResistance: true },
          settings: { timeStep: 0.02, duration: 8 },
        }),
      },
      {
        userId: darrel.id,
        forumId: freeFallForum.id,
        storedValues: JSON.stringify({
          simulationName: "Free Fall Test",
          objects: [
            { id: 1, type: "ball", mass: 1, height: 20, velocity: 0 },
            { id: 2, type: "rock", mass: 2, height: 15, velocity: 0 },
          ],
          environment: { gravity: 9.81 },
          settings: { timeStep: 0.016, duration: 5 },
        }),
      },
      {
        userId: darrel.id,
        forumId: projectileForum.id,
        storedValues: JSON.stringify({
          simulationName: "Projectile Motion Test",
          objects: [
            { id: 1, type: "ball", mass: 1, velocity: 20, angle: 45 },
            { id: 2, type: "arrow", mass: 0.5, velocity: 30, angle: 60 },
          ],
          environment: { gravity: 9.81, wind: { speed: 2, direction: "E" } },
          settings: { timeStep: 0.016, duration: 12 },
        }),
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
