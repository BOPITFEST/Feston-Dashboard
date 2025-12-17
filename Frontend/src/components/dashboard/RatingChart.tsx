import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RatingChartProps {
  data: { name: string; count: number }[];
}

const COLORS = [
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
];

export function RatingChart({ data }: RatingChartProps) {
  return (
    <Card className="shadow-sm border border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground/90">
          Cases by Rating
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)} margin={{ left: -10, right: 10 }}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                width={30}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />

              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.slice(0, 8).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
