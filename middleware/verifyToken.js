import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Token tidak ditemukan di header Authorization");
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user di request
    next();
  } catch (error) {
    console.error("Token tidak valid:", error.message);
    return res.status(403).json({ message: "Token tidak valid." });
  }
};

