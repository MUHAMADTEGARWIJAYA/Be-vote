import User from "../models/userModel.js";
import Vote from "../models/voteModel.js";

export const vote = async (req, res) => {
  try {
    // Debug untuk memeriksa data yang diterima
    console.log("Request body:", req.body);

    const { nim, candidate } = req.body;

    // Validasi jika nim atau candidate tidak ada
    if (!nim || !candidate) {
      return res.status(400).json({
        message: "NIM dan kandidat harus diisi.",
      });
    }

    // Validasi apakah candidate yang dipilih valid
    const validCandidates = ["Candidate 1", "Candidate 2"]; // Sesuaikan dengan daftar kandidat yang valid
    if (!validCandidates.includes(candidate)) {
      return res.status(400).json({
        message: "Kandidat tidak valid.",
      });
    }

    // Validasi user berdasarkan NIM
    const user = await User.findOne({ nim });

    if (!user) {
      return res.status(400).json({
        message: "NIM tidak ditemukan.",
      });
    }

    // Debug: Periksa status hasVoted sebelum melanjutkan
    console.log(`Status hasVoted untuk NIM ${nim}:`, user.hasVoted);

    // Periksa apakah user sudah pernah memilih
    if (user.hasVoted) {
      return res.status(400).json({
        message: "User sudah memilih.",
      });
    }

    // Rekam suara ke database
    const vote = await Vote.create({ nim, candidate });

    // Update status user menjadi sudah memilih
    user.hasVoted = true;
    await user.save();

    // Debug: Pastikan status hasVoted terupdate
    console.log(`Status hasVoted untuk NIM ${nim} setelah vote:`, user.hasVoted);

    res.status(200).json({ message: "Voting berhasil." });
  } catch (error) {
    // Menangani error yang terjadi
    console.error("Error during vote:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Data tidak valid.",
        error: error.message,
      });
    }

    // General error handling
    res.status(500).json({
      message: "Terjadi kesalahan saat memproses vote.",
      error: error.message || error,
    });
  }
};
