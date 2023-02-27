const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const router = new express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body.payload;
    const newName = name?.toLowerCase();
    const user = new User({ name: newName, email, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.send({ user, token }).status(201);
  } catch (error) {
    res.status(400).send({ error: "Email already exist" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.payload.email,
      req.body.payload.password
    );
    const token = await user.generateAuthToken();
    res.header(token).status(200).send({ user: user, token: token });
  } catch (error) {
    console.log("error", error.message);
    res.status(400).send({ error: error.message });
  }
});

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body.payload);
  const allowedUpdates = ["name", "email"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  // updates.map((update) => {
  //   if (req.user[update] === req.body.payload[update]) {
  //     throw new Error("Entered data can be different then previous data.");
  //   }
  // });
  try {
    updates.forEach((update) => (req.user[update] = req.body.payload[update]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user", auth, async (req, res) => {
  const user = req.user;
  res.status(200).send({ user });
});

const imageStorage = multer.memoryStorage({
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

const imageUpload = multer({ imageStorage });
router.post(
  "/user/message/image",
  imageUpload.single("image"),
  auth,
  async (req, res) => {
    console.log("typeof req.file", typeof req.file);

    console.log("req.file.filename", req.file);
    const image = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const message = new Message({
      image: image,
      imageName: req.file.originalname,
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
  }
);

router.patch("/forgotPassword", async (req, res) => {
  if (!req.body?.payload?.email) {
    res.status(400).send({ error: "Please enter email" });
  }
  const user = await User.findOne({ email: req.body?.payload?.email });
  if (!user) {
    res.status(400).send({ error: "Please enter valid email" });
  } else {
    try {
      user.password = req.body?.payload?.password;
      await user.save();
      res.status(200).send(req.user);
    } catch (error) {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send("Logout Success");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = router;
