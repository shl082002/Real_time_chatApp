import mongoose from "mongoose";
const schema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 4,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
});

const USER = mongoose.model("USER", schema, "USER");
export default USER;
