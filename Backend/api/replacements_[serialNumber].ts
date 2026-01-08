import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { serialNumber } = req.query;
  try {
    const record = await prisma.replacement.findUnique({
      where: { serialNumber: String(serialNumber) }
    });
    if (!record) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch replacement' });
  }
}
