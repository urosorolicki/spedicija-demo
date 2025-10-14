import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface DashboardChartProps {
  finansijeData: any[];
  materijalData: any[];
  vozilaData: any[];
}

export function DashboardChart({ finansijeData, materijalData, vozilaData }: DashboardChartProps) {
  // Financial distribution
  const finansijeChartData = useMemo(() => {
    const prihodi = finansijeData
      .filter((f) => f.tip === "prihod")
      .reduce((sum, f) => sum + f.iznos, 0);
    const rashodi = finansijeData
      .filter((f) => f.tip === "rashod")
      .reduce((sum, f) => sum + f.iznos, 0);

    return [
      { name: "Prihodi", value: prihodi, color: "hsl(142 76% 36%)" },
      { name: "Rashodi", value: rashodi, color: "hsl(0 84% 60%)" },
    ];
  }, [finansijeData]);

  // Material distribution
  const materijalChartData = useMemo(() => {
    const dovoz = materijalData
      .filter((m) => m.smer === "dovoz")
      .reduce((sum, m) => sum + m.kolicina, 0);
    const odvoz = materijalData
      .filter((m) => m.smer === "odvoz")
      .reduce((sum, m) => sum + m.kolicina, 0);

    return [
      { name: "Dovoz", value: dovoz, color: "hsl(215 85% 55%)" },
      { name: "Odvoz", value: odvoz, color: "hsl(25 95% 58%)" },
    ];
  }, [materijalData]);

  // Vehicle status distribution
  const vozilaChartData = useMemo(() => {
    const aktivan = vozilaData.filter((v) => v.status === "aktivan").length;
    const neaktivan = vozilaData.filter((v) => v.status === "neaktivan").length;

    return [
      { name: "Aktivna", value: aktivan, color: "hsl(142 76% 36%)" },
      { name: "Neaktivna", value: neaktivan, color: "hsl(215 15% 60%)" },
    ];
  }, [vozilaData]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Finansije Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            Finansijska distribucija
          </CardTitle>
          <CardDescription className="text-xs">Prihodi vs Rashodi</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={finansijeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {finansijeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value: number) => `${value.toLocaleString("sr-RS")} RSD`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Materijal Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Distribucija materijala
          </CardTitle>
          <CardDescription className="text-xs">Dovoz vs Odvoz</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={materijalChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {materijalChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value: number) => `${value.toFixed(1)} m³`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vozila Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Status vozila
          </CardTitle>
          <CardDescription className="text-xs">Aktivna vs Neaktivna</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vozilaChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vozilaChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value: number) => `${value} vozila`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
