import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface IssueChartProps {
  data: { name: string; count: number }[];
}

/* --- PROFESSIONAL COMPANY COLOR PALETTE (Non-distracting, clean) --- */
const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Green
  "#F59E0B", // Amber
  "#6366F1", // Soft Indigo
  "#EF4444", // Red
  "#0EA5E9", // Sky Blue
  "#EC4899", // Pink
];

export function IssueChart({ data }: IssueChartProps) {
  return (
    <Card className="shadow-sm rounded-xl border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Issues by Category
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            {/* X Axis */}
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis */}
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={110}
              tickLine={false}
              axisLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 10px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
            />

            {/* Bar Display */}
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
