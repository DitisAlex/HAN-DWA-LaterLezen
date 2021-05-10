const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.get("/set", async (req, res) => {
  let user = new User();
  user.email = "donaldtrump@americagreatagain.com";
  user.password = "hallowereldxd";
  user.save();
  res.sendStatus(200);
});

router.get("/reset", async (req, res) => {
  await User.deleteOne({ email: "joebiden@usa.com" });
  await User.deleteOne({ email: "donaldtrump@americagreatagain.com" });
  res.sendStatus(200);
});

module.exports = router;
