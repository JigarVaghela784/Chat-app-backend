const express = require("express");
const authRouter = require("./router/authRouter");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
app.use(cors());
const server = http.createServer(app);
require("./db/mongoose");

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000/dashboard",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("User from socket.io");
  // socket.on("user", (data) => {
  //   console.log("data", data);
  // });

  socket.on("sendMessage", (message) => {
    // const user = getUser(socket.id);
    // const filter = new Filter();
    // if (filter.isProfane(message)) {
    //   return callback("Profanity is not allowed!");
    // }
    console.log('message', message)
    io.emit("message",  message);
    // callback();
  });
});


const port = process.env.PORT;
app.use(express.json());
app.use(authRouter);

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
