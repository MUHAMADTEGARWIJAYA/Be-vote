import Vote from "../models/voteModel.js";

export const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan.", error });
  }
};
