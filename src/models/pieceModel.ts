import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pieceModel = new Schema({
  id:String,
  pieceText: String,
  authorUserName: String,
  createdAt: String,
  isCollected: Boolean,
  amount: Number,
});

export const Piece = mongoose.model("piece", pieceModel);

