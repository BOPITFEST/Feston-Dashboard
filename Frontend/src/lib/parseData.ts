export function mapDbToReplacementRecord(db: any[]): ReplacementRecord[] {
  return db.map((r, index) => ({
    id: r.id ?? index + 1,
    date: r.date ? new Date(r.date).toLocaleDateString("en-GB") : "",
    rating: r.rating || "",
    faultySerialNumber: r.faultySerialNumber || "",
    type: r.type || "",
    issue: r.issue || "",
    replacementSN: r.replacementSerialNumber || "",
    customer: r.customer || "",
    engineer: r.engineer || "",
    status: r.status || "OPEN",
    state: r.state || "",
    stockType: r.stockType || "",
    additionalComments: r.additionalComments || "",
    remark: r.remark || "",
  }));
}



export interface ReplacementRecord {
  id: number;
  date: string;
  rating: string;
  faultySerialNumber: string;
  issue: string;
  replacementSN: string;
  customer: string;
  engineer: string;
  status: string;
  state: string;
  stockType: string;
  additionalComments: string;
  remark: string;
}


export function parseCSVData(csvText: string): ReplacementRecord[] {
  const lines = csvText.split("\n").slice(3);
  const records: ReplacementRecord[] = [];

  lines.forEach((line, index) => {
    if (!line.trim()) return;

    const columns: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === "," && !inQuotes) {
        columns.push(current.trim());
        current = "";
      } else current += char;
    }
    columns.push(current.trim());

    const [
      date,
      rating,
      faultySerialNumber,
      _type,
      issue,
      replacementSN,
      status,
      state,
      customer,
      engineer,
      stockType,
      additionalComments,
      remark
    ] = columns;

    if (date && rating) {
      records.push({
        id: index + 1,
        date: date || "",
        rating: rating || "",
        faultySerialNumber: faultySerialNumber || "",
        issue: issue || "",
        replacementSN: replacementSN || "",
        customer: customer || "",
        engineer: engineer || "",
        status: status || "",
        state: state || "",
        stockType: stockType || "",
        additionalComments: additionalComments || "",
        remark: remark || "",
      });
    }
  });

  return records;
}


export function getUniqueValues(records: ReplacementRecord[], field: keyof ReplacementRecord): string[] {
  const values = new Set<string>();
  records.forEach((record) => {
    const value = record[field];
    if (value && typeof value === 'string' && value.trim()) {
      values.add(value.trim());
    }
  });
  return Array.from(values).sort();
}

export function getIssueCategories(
  records: ReplacementRecord[]
): { name: string; count: number }[] {

  const categories: Record<string, number> = {
    "MPPT Short": 0,
    "F19": 0,
    "F39": 0,
    "Inverter Display off": 0,
    "AP signal / Communication error": 0,
    "F55": 0,
    "Warning error": 0,
    "F30": 0,
    "F10": 0,
    "Self check Repeat error": 0,
  };

  records.forEach(record => {
    const issue = record.issue?.toLowerCase() || "";

    if (issue.includes("mppt")) {
      categories["MPPT Short"]++;

    } else if (issue.includes("f19")) {
      categories["F19"]++;

    } else if (issue.includes("f39")) {
      categories["F39"]++;

    } else if (
      issue.includes("display off") ||
      issue.includes("display blank")
    ) {
      categories["Inverter Display off"]++;

    } else if (
      issue.includes("ap") ||
      issue.includes("communication") ||
      issue.includes("com")
    ) {
      categories["AP signal / Communication error"]++;

    } else if (issue.includes("f55")) {
      categories["F55"]++;

    } else if (issue.includes("warning")) {
      categories["Warning error"]++;

    } else if (issue.includes("f30")) {
      categories["F30"]++;

    } else if (issue.includes("f10")) {
      categories["F10"]++;

    } else if (issue.includes("self check")) {
      categories["Self check Repeat error"]++;
    }
  });

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .filter(item => item.count > 0); // remove empty ones
}



export function getEngineerStats(records: ReplacementRecord[]): { name: string; count: number }[] {
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    const engineers = record.engineer.split(/[\/,&]/).map(e => e.trim().toUpperCase());
    engineers.forEach((eng) => {
      if (eng && eng.length > 1) {
        const normalized = eng.split(' ')[0]; // Take first name only
        stats[normalized] = (stats[normalized] || 0) + 1;
      }
    });
  });

  return Object.entries(stats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function getRatingStats(records: ReplacementRecord[]): { name: string; count: number }[] {
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    if (record.rating) {
      stats[record.rating] = (stats[record.rating] || 0) + 1;
    }
  });

  return Object.entries(stats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMonthlyTrend(records: ReplacementRecord[]): { month: string; count: number }[] {
  const monthStats: Record<string, number> = {};
  
  records.forEach((record) => {
    if (record.date) {
      const parts = record.date.split('/');
      if (parts.length >= 2) {
        const month = parts[0];
        const year = parts[2] || '2025';
        const key = `${month}/${year.slice(-2)}`;
        monthStats[key] = (monthStats[key] || 0) + 1;
      }
    }
  });

  return Object.entries(monthStats)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const [aM, aY] = a.month.split('/').map(Number);
      const [bM, bY] = b.month.split('/').map(Number);
      if (aY !== bY) return aY - bY;
      return aM - bM;
    });
}
