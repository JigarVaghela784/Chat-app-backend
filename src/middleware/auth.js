const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    // console.log('token', token)
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    // console.log("decoded", decoded);
    if (!user) {
      throw new Error("Something went wrong.");
    }
    req.token = token;
    req.user = user;
    next();    
  } catch (error) {
    // throw Error("Please authenticate" )
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
