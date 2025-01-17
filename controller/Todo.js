import { todoModel } from "../model/postModel.js";
import { userModel } from "../model/userModel.js";
import { StatusCode } from "../Utils/StatusCode.js";
import mongoose from "mongoose";

export const createTodo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "Please provide title and content" });
    }
    const existinguser = await userModel.findById({ _id: userId });
    if (
      !existinguser ||
      existinguser.isVerified === false ||
      existinguser.token !== null
    ) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const userdetails = new mongoose.Types.ObjectId(existinguser._id);
    const newTodo = await todoModel.create({
      title: title,
      content: content,
      user: userdetails,
    });
    if (!newTodo) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to create todo" });
    }
    const todoId = new mongoose.Types.ObjectId(newTodo._id);

    existinguser.todos.push(todoId);
    await existinguser.save();
    await newTodo.save();
    return res
      .status(StatusCode.CREATED)
      .json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const getTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    if (!todoId) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "Please provide todo ID" });
    }
    const todo = await todoModel.findById({ _id: todoId });
    if (!todo) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "Todo not found" });
    }
    return res
      .status(StatusCode.OK)
      .json({ message: "Todo found", data: todo });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const getUserTodo = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(StatusCode.FIELD_REQUIRED)
        .json({ message: "Please provide user ID" });
    }
    const user = await userModel.find({ _id: userId }).populate("todos");
    if (!user) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res
      .status(StatusCode.OK)
      .json({ message: "User found", data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};
