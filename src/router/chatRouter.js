const express = require("express");
const auth = require("../middleware/auth");
const Chat = require("../model/chatSchema");
const router = new express.Router();

function generateChatString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    );
  }
  return result.join("");
}

router.post("/chatuser/:id", auth, async (req, res) => {
  try {
    const messageId = req.params.id.split("&");
    console.log("messageId", messageId);
    if (messageId.length === 2) {
      let userChatId = null;
      const findChat = await Chat.find();
      const chat = findChat
        .filter((msg) => messageId.every((id) => msg.messageId.includes(id)))
        .map((msg) => msg);
      userChatId = chat[0]?.chatId;

      if (chat.length === 0) {
        const chatId = generateChatString(10);
        const chat = new Chat({ messageId, chatId });
        await chat.save();
        userChatId = chat?.chatId;
      }
      console.log("chat", chat);
      res.send(userChatId).status(200);
    }
  } catch (error) {
    res.status(400).send({ error: "Email already exist" });
  }
});
module.exports = router;
