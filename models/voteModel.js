import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  nim: {
    type: String,
    required: true,
  },
  candidate: {
    type: String,
    required: true,
    enum: ["Candidate 1", "Candidate 2"], // Tambahkan nilai yang valid
  },
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
