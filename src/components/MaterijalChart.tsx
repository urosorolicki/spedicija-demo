import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";
import { useMemo } from "react";

interface MaterijalChartProps {
  data: any[];
}

export function MaterijalChart({ data }: MaterijalChartProps) {
  // Group data by month
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { ulaz: number; izlaz: number } } = {};

    data.forEach((item) => {
      const date = new Date(item.datum);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { ulaz: 0, izlaz: 0 };
      }

      // Only count m³ for chart
      if (item.jedinica === "m³") {
        if (item.tip === "ulaz") {
          monthlyData[monthKey].ulaz += item.tezina;
        } else {
          monthlyData[monthKey].izlaz += item.tezina;
        }
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
          ulaz: monthlyData[key].ulaz,
          izlaz: monthlyData[key].izlaz,
          razlika: monthlyData[key].ulaz - monthlyData[key].izlaz,
        };
      });
  }, [data]);

  const totalUlaz = chartData.reduce((sum, item) => sum + item.ulaz, 0);
  const totalIzlaz = chartData.reduce((sum, item) => sum + item.izlaz, 0);

  return (
    <Card className="shadow-card col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Analiza materijala
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Ulaz i izlaz po mesecima (poslednih 6 meseci)
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Ukupna razlika</p>
            <p className="text-lg font-bold text-accent">
              {(totalUlaz - totalIzlaz).toFixed(1)} m³
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
            <XAxis 
              dataKey="mesec" 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: 'm³', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value: number) => [`${value.toFixed(1)} m³`, ""]}
            />
            <Legend />
            <Bar
              dataKey="ulaz"
              fill="hsl(215 85% 55%)"
              radius={[4, 4, 0, 0]}
              name="Ulaz"
            />
            <Bar
              dataKey="izlaz"
              fill="hsl(25 95% 58%)"
              radius={[4, 4, 0, 0]}
              name="Izlaz"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
