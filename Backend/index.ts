import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

// Fetch all replacements
app.get("/api/replacements", async (req: Request, res: Response) => {
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
app.get(
  "/api/replacements/:serialNumber",
  async (req: Request, res: Response) => {
    try {
      const { serialNumber } = req.params;

      const record = await prisma.replacement.findUnique({
        where: { serialNumber }
      });

      if (!record) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json(record);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch replacement" });
    }
  }
);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
let port: number;
try {
  const parsed = new URL(BACKEND_URL);
  port = Number(parsed.port) || Number(process.env.PORT) || 5000;
} catch (err) {
  port = Number(process.env.PORT) || 5000;
}

app.listen(port, () => {
  console.log(`🚀 Server running at ${BACKEND_URL} (listening on port ${port})`);
});
