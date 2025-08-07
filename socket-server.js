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

    io.on("connection", (socket) => {
      console.log(`🔗 User ${socket.id} connected to sockets`);

      socket.on("disconnect", () => {
        console.log(`🔗 User ${socket.id} disconnected from sockets`);
      });

      // User joins a room
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`📥 User ${socket.id} joined room ${roomId}`);
      });

      // Receive drawing data and broadcast to other clients in the room
      socket.on("draw", (data) => {
        // Broadcast to everyone else in the room except sender
        socket.to(data.roomId).emit("draw", data);
      });
    });
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

module.exports = initSocketServer;
