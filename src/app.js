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
  socket.on("sendMessage", (message) => {
    console.log('message', message)
    io.emit('message', message);
  });
});
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });

//   socket.on('sendMessage', (msg) => {
//     console.log('message: ' + msg);
//     io.emit('chat message', msg);
//   });
// });


const port = process.env.PORT;
app.use(express.json());
app.use(authRouter);

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
