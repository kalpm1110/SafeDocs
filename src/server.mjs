// src/server.mjs
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8080; // Use environment variable for flexibility
const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0"; // Bind to all network interfaces for external access
const app = next({ dev, hostname, port: PORT }); // Corrected 'PORT' to 'port'
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000" , // Use env for client URL
      methods: ["GET", "POST"],
      credentials: true, // Allow credentials if needed (e.g., for auth)
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected User:", socket.id);

    socket.on("join-doc", ({ docid, username }) => {
      if (!docid || !username) {
        console.error("Missing docid or username:", { docid, username });
        return;
      }
      socket.join(docid);
      console.log(`${socket.id} joined document: ${docid}`);
      socket.to(docid).emit("user-joined", `${username} joined the document`);
    });

    // Handle real-time document updates
    socket.on("doc-update", ({ docid, content }) => {
      if (!docid || !content) {
        console.error("Invalid doc-update data:", { docid, content });
        return;
      }
      // Broadcast changes to all clients in the same document room
      socket.to(docid).emit("receive-update", content);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});