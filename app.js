const express = require("express");
const authRouter = require("./src/router/authRouter");
const userRouter = require("./src/router/userRouter");
const chatRouter = require("./src/router/chatRouter");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { addUser, getUser } = require("./src/utils/user");
const app = express();
app.use(cors());
const server = http.createServer(app);
require("./src/db/mongoose");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    console.log("option", options);
    const { user, error } = addUser({ id: socket.id, ...options });
    socket.join(user?.room);
    // if (!options) {
    //   return callback(!options);
    // }
    console.log("user", user);
    socket.emit("notification", "Welcome!");
    socket.broadcast.emit("notification", `${options.name} has join!`);
  });
  socket.on("deleteMessage", (message) => {
    const user = getUser(socket.id);
    io.to(user?.room).emit("delMessage", message);
  });
  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    io.to(user?.room).emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

const port = process.env.YOUR_PORT || process.env.PORT;
app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(chatRouter);

app.get("/", (req, res) => {
  res.send("Home");
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
