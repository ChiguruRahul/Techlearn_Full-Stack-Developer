const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (safe for demo)
  await prisma.note.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.course.deleteMany();

  const course = await prisma.course.create({
    data: { title: "Demo Course - Full Stack Topics" },
  });

  const topicsData = [
    {
      title: "Welcome & Course Overview",
      content: `# Welcome 👋

This is a demo clone of a Course Topics page.

## What you can do
- Browse topics from sidebar
- Click a topic to read notes
- Use Next / Previous navigation
- Natural page scrolling (no nested scroll)
- No quiz/checkpoints interrupting navigation
`,
    },
    {
      title: "React Basics",
      content: `# React Basics

## Key ideas
- Components
- Props & state
- Routing with react-router-dom

\`\`\`js
function Hello({ name }) {
  return <div>Hello {name}</div>;
}
\`\`\`
`,
    },
    {
      title: "Express Basics",
      content: `# Express Basics

\`\`\`js
app.get("/health", (req, res) => {
  res.json({ ok: true });
});
\`\`\`
`,
    },
    {
      title: "Prisma + Postgres",
      content: `# Prisma + Postgres

We store:
- Courses
- Topics
- Notes
`,
    },
    {
      title: "Deployment Notes",
      content: `# Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon

Important:
- Use env vars
- No hardcoded API URLs
`,
    },
  ];

  for (let i = 0; i < topicsData.length; i++) {
    const item = topicsData[i];

    const topic = await prisma.topic.create({
      data: {
        courseId: course.id,
        title: item.title,
        order: i + 1,
      },
    });

    await prisma.note.create({
      data: {
        topicId: topic.id,
        content: item.content,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("✅ Course ID:", course.id);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
