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

      socket.on("clear-canvas", (roomId) => {
        console.log(`Clearing canvas in room ${roomId}`);
        roomDrawings[roomId] = [];
        socket.in(roomId).emit("clear-canvas");
      }
      );

      // Creating the voice call
      socket.on("voice-offer", ({roomId, offer}) => {
        socket.to(roomId).emit("voice-offer", {roomId, offer});
      })

      socket.on("voice-answer", ({roomId, answer}) => {
        socket.to(roomId).emit("voice-answer", {roomId, answer});
      })

      socket.on("new-ice-candidate", ({roomId, candidate}) => {
        socket.to(roomId).emit("new-ice-candidate", {roomId, candidate});
      })

      socket.on("voice-join", ({roomId}) => {
        console.log(`📥 User ${socket.id} joined voice room ${roomId}`);
      });

      socket.on("voice-leave", ({roomId}) => {
        console.log(`📤 User ${socket.id} left voice room ${roomId}`);
      });

    });
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

module.exports = initSocketServer;
