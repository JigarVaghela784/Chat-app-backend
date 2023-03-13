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
    messageId: req.body.message.messageId,
  });
  try {
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400);
  }
});
router.get("/user/message", auth, async (req, res) => {
  try {
    const message = await Message.find();
    if (!message) {
      throw new Error();
    }
    res.status(200).send(message);
  } catch (error) {
    res.send(error);
  }
});
router.get("/user/message/:id", auth, async (req, res) => {
  const messageId = req.params.id;
  console.log("messageId", messageId);
  try {
    const message = await Message.find({ messageId });
    if (!message) {
      throw new Error();
    }
    res.send(message);
  } catch (error) {
    res.send("error");
  }
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
    cb(null, "image");
  },
  dest: "image",
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
router.post(
  "/user/message/image/:id",
  upload.single("image"),
  auth,
  async (req, res) => {
    const image = await sharp(req.file.buffer)
      .png({quality:100})
      .toBuffer();
    const message = new Message({
      image: image,
      imageName: req.file.originalname,
      name: req.user.name,
      owner: req.user._id,
      email: req.user.email,
      avatar: req.user.avatar,
      messageId: req.params.id,
    });
    try {
      await message.save();
      res.status(201).send(message);
    } catch (error) {
      res.status(400);
    }
  }
);

const updateMsgStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "avatar");
  },
  dest: "avatar",
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

const uptMsgUpload = multer({ updateMsgStorage });
router.put(
  "/user/message/avatar",
  uptMsgUpload.single("avatar"),
  auth,
  async (req, res) => {
    try {
      const buffer = await sharp(req.file?.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      const message = await Message.updateMany(
        { email: req.user.email },
        { avatar: buffer },
        { isVerified: true, upsert: true }
      );
      res.send("done");
    } catch (error) {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
);

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

router.get("/user/finduser", auth, async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
