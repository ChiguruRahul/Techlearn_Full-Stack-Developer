require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const rawOrigins = process.env.CLIENT_ORIGIN || "*";
const origins =
  rawOrigins === "*"
    ? "*"
    : rawOrigins.split(",").map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: origins,
    credentials: false, // change to true only if you use cookies/auth later
  })
);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.get("/", (req, res) => res.send("TechLearn backend is running ✅"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    });
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/api/courses/:courseId/topics", async (req, res) => {
  try {
    const { courseId } = req.params;
    const topics = await prisma.topic.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      select: { id: true, title: true, order: true },
    });
    res.json({ topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

app.get("/api/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        note: { select: { content: true, updatedAt: true } },
      },
    });

    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json({ topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Backend running on port ${port}`));

