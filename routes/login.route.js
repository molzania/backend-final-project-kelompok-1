const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userModels = require("../models/users.model");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModels.findOne({ email: email });
    const unHAsh = bcrypt.compareSync(password, user.password);
    
    if (user && unHAsh) {
      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.cookie("cookie", accessToken, {
        maxAge: 30 * 60 * 1000,
      });

      res.json({
        accessToken,
      });
    } else {
      res.send("Email atau password salah");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
