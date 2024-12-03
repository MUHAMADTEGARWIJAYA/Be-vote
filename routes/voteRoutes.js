import express from "express";
import  vote  from "../controllers/voteController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/vote", verifyToken, vote);

export default router;
