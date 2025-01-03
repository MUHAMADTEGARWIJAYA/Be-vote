import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import helmet from "helmet";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";


const loginWindow = {
  start: new Date("2024-12-15T01:00:00Z"), // Waktu login dimulai (UTC)
  end: new Date("2025-12-15T08:05:00Z"),   // Waktu login berakhir (UTC)
};

// Middleware untuk cek waktu login
const checkLoginWindow = (req, res, next) => {
  const currentTime = new Date();

  // Jika waktu login belum dimulai
  if (currentTime < loginWindow.start) {
    const timeRemaining = loginWindow.start - currentTime;
    return res.status(403).json({ 
      error: `VOTE TELAH BERAKHIR: ${loginWindow.start.toISOString()}`,
      timeRemaining
    });
  }

  // Jika waktu login sudah berakhir
  if (currentTime > loginWindow.end) {
    const timePassed = currentTime - loginWindow.end;
    return res.status(403).json({
      error: `Waktu login telah berakhir. Waktu berakhir: ${loginWindow.end.toISOString()}`,
      timePassed
    });
  }

  next(); // Lanjutkan ke route berikutnya jika valid
};

dotenv.config();
const port = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true }));

// Routes

// Endpoint untuk memberikan informasi waktu login
app.get("/api/v1/auth/login-window", (req, res) => {
  const currentTime = new Date();
  const response = {
    start: loginWindow.start,
    end: loginWindow.end,
    currentTime: currentTime,
    isLoginOpen: currentTime >= loginWindow.start && currentTime <= loginWindow.end,
  };
  res.json(response);
});


app.use("/api/v1/auth", checkLoginWindow, authRoutes);
app.use("/api/v1/", voteRoutes); // Menghubungkan vote routes
app.use("/api/v1/auth/admin", adminRoutes);

// Server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di port ${port}`);
});

// Koneksi MongoDB
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log("Database terhubung");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

export default app;
