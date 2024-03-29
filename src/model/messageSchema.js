const mongoose = require("mongoose");
// const validator = require("validator");
// const bcript = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    image: {
      type: Buffer,
    },
    imageName: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    email: {
      type: String,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      require: true,
      ref: "User",
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
