// // import express, { Request, Response } from "express";
// // import cors from "cors";
// // import { PrismaClient } from "@prisma/client";

// // const prisma = new PrismaClient();
// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // // Fetch all replacements
// // app.get("/api/replacements", async (_req: Request, res: Response) => {
// //   try {
// //     const data = await prisma.replacement.findMany({
// //       orderBy: { date: "desc" }
// //     });
// //     res.json(data);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to fetch replacements" });
// //   }
// // });

// // // Fetch single replacement by serial number
// // app.get(
// //   "/api/replacements/:serialNumber",
// //   async (req: Request, res: Response) => {
// //     try {
// //       const { serialNumber } = req.params;

// //       const record = await prisma.replacement.findUnique({
// //         where: { serialNumber }
// //       });

// //       if (!record) {
// //         return res.status(404).json({ error: "Not found" });
// //       }

// //       res.json(record);
// //     } catch (err) {
// //       console.error(err);
// //       res.status(500).json({ error: "Failed to fetch replacement" });
// //     }
// //   }
// // );

// // app.get("/check", (req, res) => {
// //   return res.json({ 
// //     message: "Running Successdsfully"
// //   });
// // });

// // const PORT = process.env.PORT || 5000; 
// //   app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// //   });


// import express, { Request, Response } from "express";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Fetch all replacements
// app.get("/api/replacements", async (_req: Request, res: Response) => {
//   try {
//     const data = await prisma.replacement.findMany({
//       orderBy: { date: "desc" }
//     });
//     res.json(data);
//   } catch (err) {
//     console.error("Error fetching replacements:", err);
//     res.status(500).json({ error: "Failed to fetch replacements" });
//   }
// });

// // Fetch single replacement by serial number
// app.get("/api/replacements/:serialNumber", async (req: Request, res: Response) => {
//   try {
//     const { serialNumber } = req.params;

//     const record = await prisma.replacement.findUnique({
//       where: { serialNumber }
//     });

//     if (!record) {
//       return res.status(404).json({ error: "Not found" });
//     }

//     res.json(record);
//   } catch (err) {
//     console.error("Error fetching replacement:", err);
//     res.status(500).json({ error: "Failed to fetch replacement" });
//   }
// });

// // Health check
// app.get("/check", (_req: Request, res: Response) => {
//   res.json({ message: "Running Successfully" });
// });

// const PORT = Number(process.env.PORT) || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

/**
 * GET ALL replacements
 */
app.get("/api/replacements", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.replacement.findMany({
      orderBy: { date: "desc" }
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching replacements:", err);
    res.status(500).json({ error: "Failed to fetch replacements" });
  }
});

/**
 * GET replacements by Faulty Inverter Serial Number
 * (can return multiple rows)
 */
app.get(
  "/api/replacements/faulty/:faultySerialNumber",
  async (req: Request, res: Response) => {
    try {
      const { faultySerialNumber } = req.params;

      const records = await prisma.replacement.findMany({
        where: { faultySerialNumber },
        orderBy: { date: "desc" }
      });

      if (records.length === 0) {
        return res.status(404).json({ error: "No records found" });
      }

      res.json(records);
    } catch (err) {
      console.error("Error fetching replacement:", err);
      res.status(500).json({ error: "Failed to fetch replacement" });
    }
  }
);

/**
 * Health check
 */
app.get("/check", (_req: Request, res: Response) => {
  res.json({ message: "Running Successfully" });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
