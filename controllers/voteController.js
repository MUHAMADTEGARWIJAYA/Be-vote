import User from "../models/userModel.js";
import Vote from "../models/voteModel.js";

export const vote = async (req, res) => {
  try {
    // Debug untuk memeriksa data yang diterima
    console.log("Request body:", req.body);

    const { nim, candidate } = req.body;

    // Validasi user berdasarkan NIM
    const user = await User.findOne({ nim });
    if (!user || user.hasVoted) {
      return res.status(400).json({
        message: "User sudah memilih atau NIM tidak valid.",
      });
    }

    // Rekam suara ke database
    await Vote.create({ nim, candidate });
    user.hasVoted = true;
    await user.save();

    console.log("Vote berhasil:", { nim, candidate });

    res.status(200).json({ message: "Voting berhasil." });
  } catch (error) {
    console.error("Error during vote:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memproses vote.",
      error,
    });
  }
};
