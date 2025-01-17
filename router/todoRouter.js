import express from "express";
import { createTodo } from "../controller/Todo.js";

const router = express.Router();

router.post("/create-todo/:userId", createTodo);

export default router;
