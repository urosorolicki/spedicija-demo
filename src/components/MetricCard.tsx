import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export const MetricCard = ({ title, value, icon: Icon, trend, className }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("shadow-card border-border transition-smooth hover:shadow-lg", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {trend && (
                <p className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  trend.positive ? "text-success" : "text-destructive"
                )}>
                  {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl",
              className?.includes("accent") ? "bg-accent/10" : "bg-primary/10"
            )}>
              <Icon className={cn(
                "h-7 w-7",
                className?.includes("accent") ? "text-accent" : "text-primary"
              )} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
