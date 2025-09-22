const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: Boolean,
});
const Task = mongoose.model("Task", taskSchema);

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.json({ message: "User registered" });
});

// Create Task
app.post("/tasks", async (req, res) => {
  const { userId, text } = req.body;
  const task = new Task({ userId, text, completed: false });
  await task.save();
  res.json(task);
});

// Get Tasks
app.get("/tasks/:userId", async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

app.listen(5000, () => console.log("Server running on port 5000"));
