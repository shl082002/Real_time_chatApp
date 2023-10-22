import mongoose from "mongoose";
const schema = mongoose.Schema({
  groupid: { type: String, required: true },
  members: [
    {
      socketid: { type: String, require: true },
      userid: { type: String, require: true },
    },
  ],
});

const GROUP_SOCKETS = mongoose.model("GROUP-SOCKETS", schema, "GROUP-SOCKETS");
export default GROUP_SOCKETS;
