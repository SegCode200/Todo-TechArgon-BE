import express from "express";
import { RegisterUser } from "../controller/User.js";

const router = express.Router();

router.route("/register").post(RegisterUser);

export default router;
