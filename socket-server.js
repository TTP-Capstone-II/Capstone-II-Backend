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
    const users = {};

    io.on("connection", (socket) => {
      console.log(`🔗 User ${socket.id} connected to sockets`);

      // User joins a room
      socket.on("join-room", ({ roomId, username }) => {
        socket.data.roomId = roomId;

        if (users[roomId]) {
          const length = users[roomId].length;
          if (length == 3) {
            socket.emit("room full");
            return;
          }
          users[roomId].push(socket.id);          
        } else {
          users[roomId] = [socket.id];
        }
        socket.join(roomId);
        console.log(`📥 User ${socket.id} joined room ${roomId}`);

        const usersInThisRoom = users[roomId].filter(id => id !== socket.id); // filter for other users
        socket.to(roomId).emit("user-joined", {id: socket.id, username}); // maybe delete later
        socket.emit("all users", usersInThisRoom);
        console.log("users:", usersInThisRoom);
        
        // Send existing drawings to new client
        if (roomDrawings[roomId]) {
          roomDrawings[roomId].forEach((line) => {
            socket.emit("draw", line);
          });
        }
      });

      socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        let room = users[roomId];
        if (room) {
          room = room.filter(id => id !== socket.id);
          users[roomId] = room;
        }
        console.log(`🔗 User ${socket.id} disconnected from sockets`);
      });

      // Receive drawing data and broadcast to other clients in the room
      socket.on("draw", ({ line }) => {
        const roomId = socket.data.roomId;
        if (!roomId || !users[roomId]?.includes(socket.id)) return;
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

});
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

module.exports = initSocketServer;
