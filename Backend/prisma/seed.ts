import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

/**
 * CSV column interface
 */
interface ReplacementRow {
  DATE: string;
  "Rating /Ph": string;
  "Serial Number": string;
  TYPE?: string;
  ISSUE: string;
  "Replacement S.N"?: string;
  STATE: string;
  CUSTOMER?: string;
  ENGINEER?: string;
  REMARK?: string;
}

/**
 * Read CSV helper
 */
async function readCSV(filePath: string): Promise<ReplacementRow[]> {
  return new Promise((resolve, reject) => {
    const results: ReplacementRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ skipLines: 2 })) // skips title rows
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

/**
 * Convert DD-MM-YYYY → Date
 */
function parseDate(value: string): Date {
  const [dd, mm, yyyy] = value.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
}

async function main() {
  // Use process.cwd() + relative path instead of import.meta.url
  const filePath = path.join(process.cwd(), "prisma", "Replacement.csv");

  const rows = await readCSV(filePath);

  const mappedRows = rows
    .filter((r) => r["Serial Number"]) // safety check
    .map((r) => ({
      date: parseDate(r.DATE),
      rating: r["Rating /Ph"],
      serialNumber: r["Serial Number"].trim(),
      type: r.TYPE || null,
      issue: r.ISSUE,
      replacementSerialNumber: r["Replacement S.N"] || null,
      state: r.STATE,
      customer: r.CUSTOMER || null,
      engineer: r.ENGINEER || null,
      remark: r.REMARK || null,
      status: "OPEN",
    }));

  await prisma.replacement.createMany({
    data: mappedRows,
    skipDuplicates: true,
  });

  console.log(`🌱 Seeded ${mappedRows.length} replacement records`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
