import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Fetch all replacements
app.get("/api/replacements", async (_req: Request, res: Response) => {
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


const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_URL = process.env.PUBLIC_URL || `http://${HOST}:${PORT}`;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${PUBLIC_URL}`);
});
