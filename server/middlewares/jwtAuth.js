import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let jwtAuth = async (req, res, next) => {
  const token = req.header("usertoken");
  if (!token) return res.status(500).json({ error: "Token Not Found" });

  try {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) return res.status(500).json({ error: "Token is not valid" });
      else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error });
  }
};

export default jwtAuth;
