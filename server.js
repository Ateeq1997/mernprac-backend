// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// --- Schemas ---
const userSchema = new mongoose.Schema({
  username: String,
});

const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

// --- Routes ---

// get all tasks for a user
app.get("/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add new task
app.post("/tasks", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const task = new Task({ userId, text });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// optional: add a user
app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;
    const user = new User({ username });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
