const express = require("express");
const auth = require("../middleware/auth");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const router = new express.Router();

router.post("/signup", async (req, res) => {
  try {
    const {name,email,password}=req.body.payload
    const newName= name?.toLowerCase()
    const user = new User({name:newName,email,password});
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

router.get("/user", auth, async (req, res) => {
  const user = req.user;
  res.status(200).send({ user });
});
router.get("/user/message", auth, async (req, res) => {
  const message = await Message.find();
  res.status(200).send({ message });
});

router.post("/user/message", auth, async (req, res) => {
  const message = new Message({
    ...req.body,
    name: req.user.name,
    owner: req.user._id,
    email: req.user.email,
  });
  try {
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400);
  }
});

router.patch("/forgotPassword", async (req, res) => {
  console.log("req..body", req.body);
  if (!req.body?.payload?.email) {
    res.status(400).send({ error: "Please enter email" });
  // } else {
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
  // }
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
