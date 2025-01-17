import express from "express";
import {
  RegisterUser,
  loginUser,
  getUser,
  VerifyUser,
} from "../controller/User.js";

const router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.get("/get-user/:userId", getUser);
router.get("/verify-user/:userId", VerifyUser);

export default router;
