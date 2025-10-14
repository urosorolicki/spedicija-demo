import { DollarSign, TrendingDown, Wallet, Truck } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { DashboardChart } from "@/components/DashboardChart";
import { VehicleNotifications } from "@/components/VehicleNotifications";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getFinansije } from "@/services/finansijeService";
import { getMaterijali } from "@/services/materijalService";
import { getVozila } from "@/services/vozilaService";

export default function Dashboard() {
  const { user } = useAuth();
  const [vozilaData, setVozilaData] = useState<any[]>([]);
  const [finansijeData, setFinansijeData] = useState<any[]>([]);
  const [materijalData, setMaterijalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const [vozilaResult, finansijeResult, materijalResult] = await Promise.all([
      getVozila(user.id),
      getFinansije(user.id),
      getMaterijali(user.id),
    ]);
    
    if (vozilaResult.success && vozilaResult.vozila) {
      setVozilaData(vozilaResult.vozila);
    }
    
    if (finansijeResult.success && finansijeResult.finansije) {
      setFinansijeData(finansijeResult.finansije);
    }
    
    if (materijalResult.success && materijalResult.materijali) {
      setMaterijalData(materijalResult.materijali);
    }
    
    setIsLoading(false);
  };
  
  const ukupniPrihodi = finansijeData
    .filter((f) => f.tip === "prihod")
    .reduce((sum, f) => sum + f.iznos, 0);

  const ukupniRashodi = finansijeData
    .filter((f) => f.tip === "rashod")
    .reduce((sum, f) => sum + f.iznos, 0);

  const saldo = ukupniPrihodi - ukupniRashodi;
  const aktivnaVozila = vozilaData.filter((v) => v.status === "aktivan").length;

  const materijalPoTipu = materijalData.reduce((acc, item) => {
    const existing = acc.find((x) => x.tip === item.materijal);
    if (existing) {
      existing.dovoz += item.tip === "dovoz" ? item.tezina : 0;
      existing.odvoz += item.tip === "odvoz" ? item.tezina : 0;
    } else {
      acc.push({
        tip: item.materijal,
        dovoz: item.tip === "dovoz" ? item.tezina : 0,
        odvoz: item.tip === "odvoz" ? item.tezina : 0,
      });
    }
    return acc;
  }, [] as { tip: string; dovoz: number; odvoz: number }[]);

  // Generate monthly data from finansije
  const mesecniData = finansijeData.reduce((acc, item) => {
    const date = new Date(item.datum);
    const mesec = date.toLocaleDateString('sr-RS', { month: 'short' });
    const existing = acc.find((x) => x.mesec === mesec);
    
    if (existing) {
      if (item.tip === 'prihod') {
        existing.prihodi += item.iznos;
      } else {
        existing.rashodi += item.iznos;
      }
    } else {
      acc.push({
        mesec,
        prihodi: item.tip === 'prihod' ? item.iznos : 0,
        rashodi: item.tip === 'rashod' ? item.iznos : 0,
      });
    }
    return acc;
  }, [] as { mesec: string; prihodi: number; rashodi: number }[]);

  const poslednjeTransakcije = finansijeData.slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Pregled ključnih metrika i aktivnosti</p>
        </div>
        <VehicleNotifications vozila={vozilaData} />
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Dashboard Charts */}
      <DashboardChart 
        finansijeData={finansijeData}
        materijalData={materijalData}
        vozilaData={vozilaData}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-primary" />
              Mesečni prihodi i rashodi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200} className="mt-2">
              <LineChart data={mesecniData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="mesec" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: '8px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: '8px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="prihodi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Prihodi"
                />
                <Line
                  type="monotone"
                  dataKey="rashodi"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Rashodi"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-accent" />
              Materijal - Dovoz/Odvoz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={materijalPoTipu}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="tip" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: '8px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: '8px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: '12px'
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
          <CardTitle className="text-lg">Poslednje transakcije</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap text-xs sm:text-sm">Datum</TableHead>
                  <TableHead className="whitespace-nowrap text-xs sm:text-sm">Tip</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Kategorija</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Opis</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Vozilo</TableHead>
                  <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">Iznos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poslednjeTransakcije.map((transakcija) => (
                  <TableRow key={transakcija.id}>
                    <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">
                      {new Date(transakcija.datum).toLocaleDateString("sr-RS")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transakcija.tip === "prihod" ? "default" : "destructive"}
                        className="whitespace-nowrap text-xs"
                      >
                        {transakcija.tip}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{transakcija.kategorija}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate text-xs sm:text-sm">{transakcija.opis}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{transakcija.vozilo}</TableCell>
                    <TableCell
                      className={`text-right font-semibold whitespace-nowrap text-xs sm:text-sm ${
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
