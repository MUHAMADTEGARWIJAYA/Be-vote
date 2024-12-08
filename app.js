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
  start: new Date("2024-12-08T08:00:00Z"), // Waktu login dimulai (UTC)
  end: new Date("2024-12-08T10:00:00Z"),   // Waktu login berakhir (UTC)
};

const checkLoginWindow = (req, res, next) => {
  const currentTime = new Date();

  if (currentTime < loginWindow.start) {
    return res.status(403).json({ error: "Login belum dimulai." });
  }

  if (currentTime > loginWindow.end) {
    return res.status(403).json({ error: "Waktu login telah berakhir." });
  }

  next(); // Jika valid, lanjutkan ke route berikutnya
};

dotenv.config();
const port = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://fe-vote.vercel.app", // Ganti dengan domain FE jika di produksi
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true }));

// Routes
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
