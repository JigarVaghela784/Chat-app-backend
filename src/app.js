// const express = require("express");
// const authRouter = require("./router/authRouter");
// const cors = require("cors");
// const socketIo = require("socket.io");
// const http = require("http");
// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// require("./db/mongoose");
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000/dashboard",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {

//   socket.on("deleteMessage",(message)=>{
//     io.emit("delMessage", message);
//   })
//   socket.on("sendMessage", (message) => {
//     console.log('message', message)
//     io.emit("message", message);
//   });
// });

// const port = process.env.PORT;
// app.use(express.json());
// app.use(authRouter);

// app.get('/',(req,res)=>{
//   res.send("Home")
// })

// server.listen(port, () => {
//   console.log(`Server running at port ${port}`);
// });