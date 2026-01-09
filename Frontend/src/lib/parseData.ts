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

export function getIssueCategories(records: ReplacementRecord[]): { name: string; count: number }[] {
  const categories: Record<string, number> = {};
  
  records.forEach((record) => {
    const issue = record.issue.toLowerCase();
    let category = 'Other';
    
    if (issue.includes('mppt short') || issue.includes('mppt')) {
      category = 'MPPT Short';
    } else if (issue.includes('not turning on') || issue.includes('not turn on') || issue.includes('display off') || issue.includes('display blank')) {
      category = 'Not Turning ON';
    } else if (issue.includes('f39') || issue.includes('f35') || issue.includes('f19') || issue.includes('f24') || issue.includes('f55') || issue.includes('f64') || issue.includes('f33') || issue.includes('f18') || issue.includes('f10')) {
      category = 'Error Codes';
    } else if (issue.includes('not producing') || issue.includes('low production')) {
      category = 'Low Production';
    } else if (issue.includes('com') || issue.includes('logger') || issue.includes('ap not') || issue.includes('wifi')) {
      category = 'Communication';
    } else if (issue.includes('self check')) {
      category = 'Self Check Error';
    }
    
    categories[category] = (categories[category] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
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
