const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const router = new express.Router();

router.post("/user/message", auth, async (req, res) => {
  const message = new Message({
    message: req.body.message.message,
    name: req.user.name,
    owner: req.user._id,
    email: req.user.email,
    avatar: req.user.avatar,
  });
  try {
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400);
  }
});
router.get("/user/message", auth, async (req, res) => {
  const message = await Message.find();
  res.status(200).send({ message });
});

router.delete("/user/message/:id", auth, async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(200).send(message);
    }
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, "avatars");
    },
    dest: "avatars",
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error("Please upload an image"));
      }
      cb(undefined, true);
    },
  });
  
  const upload = multer({ storage });
  router.post("/user/avatar", upload.single("avatar"), auth, async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send({ msg: "Profile Image Uploaded" });
    } catch (error) {
      console.log("error", error);
      res.send({ error });
    }
  });
  router.get("/user/avatar", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.avatar) {
        throw new Error();
      }
      res.set("Content-Type", "image/jpg");
      res.json(user.avatar);
    } catch (error) {
      res.status(404).send();
    }
  });

  module.exports = router;
