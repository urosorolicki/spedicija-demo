import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";

interface FinansijeChartProps {
  data: any[];
}

export function FinansijeChart({ data }: FinansijeChartProps) {
  // Group data by month
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { prihodi: number; rashodi: number } } = {};

    data.forEach((item) => {
      const date = new Date(item.datum);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { prihodi: 0, rashodi: 0 };
      }

      if (item.tip === "prihod") {
        monthlyData[monthKey].prihodi += item.iznos;
      } else {
        monthlyData[monthKey].rashodi += item.iznos;
      }
    });

    // Convert to array and sort by date
    return Object.keys(monthlyData)
      .sort()
      .slice(-6) // Last 6 months
      .map((key) => {
        const [year, month] = key.split("-");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
        return {
          mesec: monthNames[parseInt(month) - 1],
          prihodi: monthlyData[key].prihodi,
          rashodi: monthlyData[key].rashodi,
          neto: monthlyData[key].prihodi - monthlyData[key].rashodi,
        };
      });
  }, [data]);

  const totalPrihodi = chartData.reduce((sum, item) => sum + item.prihodi, 0);
  const totalRashodi = chartData.reduce((sum, item) => sum + item.rashodi, 0);
  const trend = totalPrihodi > totalRashodi;

  return (
    <Card className="shadow-card col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {trend ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
              Finansijski pregled
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Prihodi i rashodi po mesecima (poslednih 6 meseci)
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Ukupan trend</p>
            <p className={`text-lg font-bold ${trend ? "text-success" : "text-destructive"}`}>
              {trend ? "+" : "-"}
              {Math.abs(totalPrihodi - totalRashodi).toLocaleString("sr-RS")} RSD
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrihodi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRashodi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
            <XAxis 
              dataKey="mesec" 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value: number) => [`${value.toLocaleString("sr-RS")} RSD`, ""]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="prihodi"
              stroke="hsl(142 76% 36%)"
              fill="url(#colorPrihodi)"
              strokeWidth={2}
              name="Prihodi"
            />
            <Area
              type="monotone"
              dataKey="rashodi"
              stroke="hsl(0 84% 60%)"
              fill="url(#colorRashodi)"
              strokeWidth={2}
              name="Rashodi"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
