import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Dbconfig } from "../Utils/database.js";
import user from "../router/userRouter.js";
import todo from "../router/todoRouter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", user);
app.use("/api/v1/todo", todo);
app.get("/get", (req, res) => {
  res.json("Welcome to the API");
});
Dbconfig();
app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on port ${PORT}`);
});
