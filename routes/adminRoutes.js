import express from "express";
import { getVotes } from "../controllers/adminController.js";

const router = express.Router();

router.get("/votes", getVotes);

export default router;
