import express from "express";
import { createTodo, getTodo, getUserTodo } from "../controller/Todo.js";

const router = express.Router();

router.post("/create-todo/:userId", createTodo);
router.get("/get-one-todo/:todoId", getTodo);
router.get("/get-user-all-todo/:userId", getUserTodo);

export default router;
