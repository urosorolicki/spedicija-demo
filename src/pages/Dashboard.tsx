import { DollarSign, TrendingDown, Wallet, Truck } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import finansijeData from "@/data/finansije.json";
import materijalData from "@/data/materijal.json";
import vozilaData from "@/data/vozila.json";
import mesecniData from "@/data/mesecniPodaci.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const ukupniPrihodi = finansijeData
    .filter((f) => f.tip === "prihod")
    .reduce((sum, f) => sum + f.iznos, 0);

  const ukupniRashodi = finansijeData
    .filter((f) => f.tip === "rashod")
    .reduce((sum, f) => sum + f.iznos, 0);

  const saldo = ukupniPrihodi - ukupniRashodi;
  const aktivnaVozila = vozilaData.filter((v) => v.status === "aktivan").length;

  const materijalPoTipu = materijalData.reduce((acc, item) => {
    const existing = acc.find((x) => x.tip === item.tip);
    if (existing) {
      existing.dovoz += item.smer === "dovoz" ? item.kolicina : 0;
      existing.odvoz += item.smer === "odvoz" ? item.kolicina : 0;
    } else {
      acc.push({
        tip: item.tip,
        dovoz: item.smer === "dovoz" ? item.kolicina : 0,
        odvoz: item.smer === "odvoz" ? item.kolicina : 0,
      });
    }
    return acc;
  }, [] as { tip: string; dovoz: number; odvoz: number }[]);

  const poslednjeTransakcije = finansijeData.slice(0, 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Pregled ključnih metrika i aktivnosti</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ukupni prihodi"
          value={`${ukupniPrihodi.toLocaleString("sr-RS")} RSD`}
          icon={DollarSign}
          trend={{ value: 12.5, positive: true }}
        />
        <MetricCard
          title="Ukupni rashodi"
          value={`${ukupniRashodi.toLocaleString("sr-RS")} RSD`}
          icon={TrendingDown}
          trend={{ value: 3.2, positive: false }}
        />
        <MetricCard
          title="Saldo"
          value={`${saldo.toLocaleString("sr-RS")} RSD`}
          icon={Wallet}
          trend={{ value: 8.7, positive: true }}
          className="border-accent"
        />
        <MetricCard
          title="Aktivna vozila"
          value={aktivnaVozila}
          icon={Truck}
          className="border-accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Mesečni prihodi i rashodi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mesecniData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mesec" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="prihodi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Prihodi"
                />
                <Line
                  type="monotone"
                  dataKey="rashodi"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={3}
                  name="Rashodi"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Materijal - Dovoz/Odvoz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materijalPoTipu}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tip" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="dovoz" fill="hsl(var(--primary))" name="Dovoz (m³)" />
                <Bar dataKey="odvoz" fill="hsl(var(--accent))" name="Odvoz (m³)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Poslednje transakcije</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Kategorija</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Vozilo</TableHead>
                <TableHead className="text-right">Iznos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poslednjeTransakcije.map((transakcija) => (
                <TableRow key={transakcija.id}>
                  <TableCell className="font-medium">
                    {new Date(transakcija.datum).toLocaleDateString("sr-RS")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transakcija.tip === "prihod" ? "default" : "destructive"}
                    >
                      {transakcija.tip}
                    </Badge>
                  </TableCell>
                  <TableCell>{transakcija.kategorija}</TableCell>
                  <TableCell className="max-w-xs truncate">{transakcija.opis}</TableCell>
                  <TableCell>{transakcija.vozilo}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transakcija.tip === "prihod" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {transakcija.tip === "prihod" ? "+" : "-"}
                    {transakcija.iznos.toLocaleString("sr-RS")} RSD
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
