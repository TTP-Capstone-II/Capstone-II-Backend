const { Server } = require("socket.io");

let io;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: FRONTEND_URL,
        credentials: true,
      }
    : {
        cors: "*",
      };

const initSocketServer = (server) => {
  try {
    io = new Server(server, corsOptions);

    const roomDrawings = {};

    io.on("connection", (socket) => {
      console.log(`🔗 User ${socket.id} connected to sockets`);

      socket.on("disconnect", () => {
        console.log(`🔗 User ${socket.id} disconnected from sockets`);
      });

      // User joins a room
      socket.on("join-room", ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`📥 User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("user-joined", username);

        // Send existing drawings to new client
        if (roomDrawings[roomId]) {
          roomDrawings[roomId].forEach((line) => {
            socket.emit("draw", line);
          });
        }
      });

      // Receive drawing data and broadcast to other clients in the room
      socket.on("draw", ({ roomId, line }) => {
        console.log(`Draw in room ${roomId}`);
        if (!roomDrawings[roomId]) roomDrawings[roomId] = [];
        roomDrawings[roomId].push(line);

        socket.in(roomId).emit("draw", line);
      });

      // Real time post updates
      socket.on("join-post", ({ postId }) => {
        socket.join(`post_${postId}`);
      });
      socket.on("new-reply", (reply) => {
        const roomName = `post_${reply.postId}`;
        socket.to(roomName).emit("new-reply", reply);
      });
    });
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

const getIO = () => io;

module.exports = { initSocketServer, getIO };
