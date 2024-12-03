import User from "../models/userModel.js";
import Vote from "../models/voteModel.js";

export const vote = async (req, res) => {
  try {
    // Debug untuk memeriksa data yang diterima dari token dan body
    console.log("Payload token:", req.user);
    console.log("Request body:", req.body);

    const { candidate } = req.body;
    const { id, nim } = req.user; // Ambil data dari `verifyToken` (req.user)

    // Validasi kandidat
    if (!candidate) {
      return res.status(400).json({ message: "Kandidat tidak boleh kosong." });
    }

    // Validasi user berdasarkan NIM (dari token)
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "Anda sudah memberikan suara." });
    }

    // Rekam suara ke database
    await Vote.create({ nim, candidate });
    user.hasVoted = true; // Tandai user sudah memilih
    await user.save();

    console.log("Vote berhasil:", { nim, candidate });

    res.status(200).json({ message: "Voting berhasil." });
  } catch (error) {
    console.error("Error during vote:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memproses vote.",
      error: error.message, // Kirimkan pesan error untuk debugging
    });
  }
};