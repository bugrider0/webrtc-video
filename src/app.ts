import path from "path";
import http from "http";

import "dotenv/config";
import express, { Application } from "express";
import { Server } from "socket.io";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// Socket Users
let users: string[] = [];

// Socket.IO
io.on("connection", (socket) => {
  const socketExist = users.find((user) => user === socket.id);

  if (!socketExist) {
    users.push(socket.id);
    socket.emit("updateUsersList", {
      users: users.filter((currentSocket) => currentSocket !== socket.id),
    });
    // socket.broadcast.emit("updateUsersList", { users: [socket.id] });
    socket.on("callUser", (data) => {
      socket.to(data.target).emit("called", {
        offer: data.offer,
        socket: socket.id,
      });
    });
  }

  socket.on("disconnect", () => {
    users = users.filter((currentSocket) => currentSocket !== socket.id);
    socket.broadcast.emit("removedUser", {
      socketId: socket.id,
    });
    socket.broadcast.emit("remove-user", {
      socketId: socket.id,
    });
  });
});

// Listner
const { PORT, HOST, NODE_ENV } = process.env;
server.listen(PORT, () =>
  console.log(
    `Server is Running on -> http://${HOST}:${PORT} and ${NODE_ENV} Mode`
  )
);
