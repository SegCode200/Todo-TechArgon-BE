import { userModel } from "../model/userModel.js";
import { StatusCode } from "../Utils/StatusCode.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { sendTokenMessage } from "../Utils/email.js";
env.config();

const JWT_Secret = process.env.JWT_SECRET_KEY;

export const RegisterUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "complete your field" });
    }
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "email already exist" });
    }
    const token = crypto.randomInt(1000, 9999).toString();
    const Salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, Salt);
    if (!hashPassword) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Unable to hash password" });
    }
    const user = await userModel.create({
      fullName,
      email,
      password: hashPassword,
      token,
    });
    // const sendEmail = await sendTokenMessage(email, token);

    if (!user) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Unable to register user" });
    }
    return res.status(StatusCode.CREATED).json({
      message: "User has been created successfully",
      data: {
        id: user._id,
        name: user.fullName,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error trying to register User" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "Please complete field" });
    }
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "User does not exist" });
    }
    const checkPassword = await bcrypt.compare(password, existingUser.password);
    if (!checkPassword) {
      return res
        .status(StatusCode.NOT_ACCEPTABLE)
        .json({ message: "Incorrect password provided" });
    }
    const user = await userModel.findById({ _id: existingUser._id });
    const logintoken = jwt.sign(
      { id: user._id, name: user.fullName },
      JWT_Secret
    );
    return res
      .status(StatusCode.OK)
      .json({ message: "User succesfully login", data: logintoken });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error trying to login" });
  }
};

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.header.authorization.spllit(" ")[1];
    if (!authHeader) {
      return res
        .status(StatusCode.NOT_ACCEPTABLE)
        .json({ message: "U provided an ivailid token" });
    }
    const verifyToken = await jwt.verify(authHeader, JWT_Secret);
    next();
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Invaild token provided" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "provided your ID" });
    }
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res
      .status(StatusCode.OK)
      .json({ message: "USer found", data: user });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const VerifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;
    if (!token || !userId) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "Please provide a token" });
    }
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "User not found" });
    }
    if (user.token !== token) {
      return res
        .status(StatusCode.NOT_ACCEPTABLE)
        .json({ message: "Invalid token" });
    }
    user.token = null;
    user.isVerified = true;
    user.save();
    return res
      .status(StatusCode.OK)
      .json({ message: "Userer has been Verified" });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};
