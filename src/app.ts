import path from "path";
import http from "http";

import "dotenv/config";
import express, { Application } from "express";
import { Server } from "socket.io";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users: string[] = [];

const { PORT, HOST, NODE_ENV } = process.env;
server.listen(PORT, () =>
  console.log(
    `Server is Running on -> http://${HOST}:${PORT} and ${NODE_ENV} Mode`
  )
);
