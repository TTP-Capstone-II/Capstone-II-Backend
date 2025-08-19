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
    const roomUsers = {};

    io.on("connection", (socket) => {
      console.log(`🔗 User ${socket.id} connected to sockets`);
      
      // User joins a room
      socket.on("join-room", ({ roomId, username, penColor}) => {
        socket.emit("my-socket-id", { id: socket.id });
        socket.data.roomId = roomId;

       // Check if user is in room
        if (roomUsers[roomId]) {
          const length = roomUsers[roomId].length;
           // Check if room is full
          if (length == 3) {
            socket.emit("room full");
            return;
          }
          roomUsers[roomId].push({userId: socket.id, username, penColor});          
        } else {
          roomUsers[roomId] = [{userId: socket.id, username, penColor}];
        }
        socket.join(roomId);
        console.log(`📥 User ${socket.id} joined room ${roomId}`);

        socket.to(roomId).emit("user-joined", {id: socket.id, username}); // maybe delete later
        
        // Send existing drawings to new client
        if (roomDrawings[roomId]) {
          roomDrawings[roomId].forEach((line) => {
            socket.emit("draw", line);
          });
        }

       // Update user list for all clients in the room
       io.to(roomId).emit("update-user-list", roomUsers[roomId]);
       console.log(roomUsers)
      });

        socket.on("disconnect", () => {
       console.log(`🔗 User ${socket.id} disconnected from sockets`);
       if (socket.data.roomId) {
         roomUsers[socket.data.roomId] = roomUsers[socket.data.roomId]?.filter(u => u.userId !== socket.id) || [];
         io.to(socket.data.roomId).emit("update-user-list", roomUsers[socket.data.roomId]);
       }
     });

    // Receive drawing data and broadcast to other clients in the room
     socket.on("draw", ({ roomId, line }) => {
       console.log(`Draw in room ${roomId}`);
       if (!roomDrawings[roomId]) roomDrawings[roomId] = [];
       roomDrawings[roomId].push(line);
       socket.in(roomId).emit("draw", line);
     });

       // User joins voice
      socket.on("voice-join", ({ roomId }) => {
        // Notify all other users in the room that a new user joined
        socket.to(roomId).emit("voice-user-joined", { socketId: socket.id });
      });

      socket.on("voice-offer", ({ offer, to }) => {
          io.to(to).emit("voice-offer", { offer, from: socket.id });
        });

      socket.on("voice-answer", ({ answer, to }) => {
        io.to(to).emit("voice-answer", { answer, from: socket.id });
      });

      // Real time post updates
      socket.on("join-post", ({ postId }) => {
        socket.join(`post_${postId}`);
      });
      socket.on("new-reply", (reply) => {
        io.to(reply.room).emit("reply-added", reply);
      });
    });

      socket.on("new-ice-candidate", ({ candidate, to }) => {
        io.to(to).emit("new-ice-candidate", { candidate, from: socket.id });
      });

      socket.on("clear-canvas", (roomId) => {
       console.log(`Clearing canvas in room ${roomId}`);
       const username = roomUsers[roomId]?.find(u => u.userId === socket.id)?.username || "Unknown";
       roomDrawings[roomId] = [];
       socket.in(roomId).emit("clear-canvas", username);
     });

      socket.on("pen-color-change", ({ userId, penColor }) => {
       const roomId = socket.roomId;
       if (!roomId) return;
       roomUsers[roomId] = roomUsers[roomId].map(u =>
         u.userId === userId ? { ...u, penColor } : u
       );
       io.to(roomId).emit("update-user-list", roomUsers[roomId]);
     });
  } catch (error) {
    console.error("❌ Error initializing socket server:");
    console.error(error);
  }
};

const getIO = () => io;

module.exports = { initSocketServer, getIO };
