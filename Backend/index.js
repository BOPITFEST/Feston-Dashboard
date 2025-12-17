import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Fetch all replacements
app.get("/api/replacements", async (req, res) => {
  try {
    const data = await prisma.replacement.findMany({
      orderBy: { date: "desc" }
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch replacements" });
  }
});

// Fetch single replacement by serial number
app.get("/api/replacements/:serialNumber", async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const record = await prisma.replacement.findUnique({
      where: { serialNumber }
    });
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch replacement" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
