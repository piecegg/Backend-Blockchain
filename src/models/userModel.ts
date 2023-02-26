import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  twitterId: String,
  profileImageUrl: String
});

export const User = mongoose.model("user", userSchema);

