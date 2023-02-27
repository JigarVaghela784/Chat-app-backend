const express = require("express");
const authRouter = require("./src/router/authRouter");
const userRouter = require("./src/router/userRouter");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
app.use(cors());
const server = http.createServer(app);

require("./src/db/mongoose");

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000/dashboard",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {

  socket.on("deleteMessage", (message) => {
    io.emit("delMessage", message);
  });
  socket.on("sendMessage", (message) => {
    console.log('message', message)
    io.emit("message", message);
  });
});

const port = process.env.YOUR_PORT || process.env.PORT;
app.use(express.json());
app.use(authRouter);
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Home");
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
