const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    messageId: {
      type: Array,
      required: true,
    },
    chatId: {
      type: String,
    },
  },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
