import mongoose from "mongoose";
const schema = mongoose.Schema({
  senderid: { type: String, require: true },
  sendername: { type: String },
  recieverid: { type: String },
  groupid: { type: String },
  message: { type: String, require: true },
  timestamp: { type: String, require: true },
});

const MESSAGES = mongoose.model("MESSAGES", schema, "MESSAGES");
export default MESSAGES;
