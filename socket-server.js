const { Server } = require("socket.io");

let io;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      }
    : {
        origin: "*",
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
        socket.to(roomId).emit("user-joined", {id: socket.id, username});

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

      socket.on("voice-offer", ({ offer, to }) => {
          io.to(to).emit("voice-offer", { offer, from: socket.id });
        });

      socket.on("voice-answer", ({ answer, to }) => {
        io.to(to).emit("voice-answer", { answer, from: socket.id });
      });

      socket.on("new-ice-candidate", ({ candidate, to }) => {
        io.to(to).emit("new-ice-candidate", { candidate, from: socket.id });
      });

      socket.on("voice-join", ({roomId}) => {
        console.log(`📥 User ${socket.id} joined voice room ${roomId}`);
      
      
      socket.to(roomId).emit("voice-user-joined", { 
          userId: socket.id, 
          username: socket.username || "Anonymous" 
        });
        
        // Store the user in the voice room
      socket.join(`voice-${roomId}`);
    });
  
      socket.on("voice-leave", ({roomId}) => {
        console.log(`📤 User ${socket.id} left voice room ${roomId}`);
          
        // Notify other users in the voice room
        socket.to(roomId).emit("voice-user-left", { 
              userId: socket.id 
        });
          
        // Remove the user from the voice room
        socket.leave(`voice-${roomId}`);
      });
});
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

module.exports = initSocketServer;
