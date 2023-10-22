import dotenv from "dotenv";
dotenv.config();

let authkey = async (req, res, next) => {
  const key = req.header("AuthKey");
  if (!key || key !== process.env.AUTH_KEY) {
    return res.status(500).json({ error: "Unauthorized" });
  }
  next();
};

export default authkey;
