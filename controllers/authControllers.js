import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const login = async (req, res) => {
  try {
    const { nim } = req.body;

    // Validasi NIM
    if (!nim.includes("061") || nim.length !== 10) {
      return res.status(400).json({ message: "NIM tidak valid." });
    }

    // Cek apakah user sudah ada, jika tidak, buat user baru
    let user = await User.findOne({ nim });
    if (!user) {
      user = await User.create({ nim });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, nim: user.nim }, // Payload token
      process.env.JWT_SECRET,           // Secret key dari environment
      { expiresIn: '1h' }              // Token kedaluwarsa setelah 1 jam
    );

    // Kirim respons dengan token
    res.status(200).json({
      message: "Login berhasil",
      token,   // Kirimkan token dalam response
      user     // Informasi user (bisa ditambahkan sesuai kebutuhan)
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan.", error });
  }
};

export const logout = (req, res) => {
  try {
    // Hapus token dari klien dengan mengirimkan token kosong dan waktu kedaluwarsa
    res.status(200).json({
      message: "Logout berhasil.",
      token: null, // Atur token menjadi null
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat logout.",
      error,
    });
  }
};
