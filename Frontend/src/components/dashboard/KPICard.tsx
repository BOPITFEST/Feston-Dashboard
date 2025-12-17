import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconClassName?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  iconClassName,
  className,
}: KPICardProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          
          {/* LEFT SIDE */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>

            <p className="text-3xl font-bold">{value}</p>

            {trend && (
              <p
                className={cn(
                  "text-xs font-semibold",
                  trendUp ? "text-green-600" : "text-red-500"
                )}
              >
                {trend}
              </p>
            )}
          </div>

          {/* ICON */}
          <div
            className={cn(
              "rounded-xl p-3 flex items-center justify-center",
              iconClassName
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
