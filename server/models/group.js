import mongoose from "mongoose";
const schema = mongoose.Schema({
  groupname: { type: String, required: true },
  adminid: { type: String, require: true },
  members: [
    {
      username: { type: String, require: true },
      userid: { type: String, require: true },
    },
  ],
});

const GROUPS = mongoose.model("GROUPS", schema, "GROUPS");
export default GROUPS;
