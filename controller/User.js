import { userModel } from "../model/userModel.js";
import { StatusCode } from "../Utils/StatusCode.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

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
