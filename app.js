import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import helmet from "helmet";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();
const port = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan domain FE jika di produksi
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", voteRoutes); // Menghubungkan vote routes
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
