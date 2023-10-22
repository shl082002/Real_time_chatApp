import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import USER from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//-------------SIGNUP--------------//
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const finduser = await USER.findOne({
      username,
    });
    if (!finduser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      // return res.status(200).send(hashedPass);
      const user = await USER.create({
        username,
        password: hashedPass,
      });
      return res.status(200).send({
        userid: user._id,
        username: user.username,
      });
    } else {
      return res.status(400).send({
        message: "user already exist",
      });
    }
    //sign Token
    // jwt.sign(
    //   {
    //     user: {
    //       id: user._id,
    //     },
    //     iat: new Date().valueOf(),
    //   },
    //   process.env.SECRET_KEY,
    //   {
    //     // expiresIn: parseInt(process.env.JWT_EXPIRY_TIME)
    //     //token will never expire
    //   },
    //   (error, token) => {
    //     if (error)
    //       return res.status(400).json({ msg: "JWT sign error", error });
    //     return res.status(200).json({ token });
    //   }
    // );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//----------------LOGIN-------------------//
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await USER.findOne({
      username,
    });
    if (!user) {
      return res.status(400).send({
        message: "User Not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      //   return res.status(200).send(isMatch);
      if (!isMatch) {
        return res.status(400).send({
          message: "Invalid Password",
        });
      } else {
        //sign Token
        // jwt.sign(
        //   {
        //     user: {
        //       id: user._id,
        //     },
        //     iat: new Date().valueOf(),
        //   },
        //   process.env.SECRET_KEY,
        //   {
        //     // expiresIn: parseInt(process.env.JWT_EXPIRY_TIME)
        //     //token will never expire
        //   },
        //   (error, token) => {
        //     if (error)
        //       return res.status(400).json({ msg: "JWT sign error", error });
        //     return res.status(200).json({ token });
        //   }
        // );
        return res.status(200).send({
          userid: user._id,
          username: user.username,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
export default router;
