import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import finansijeData from "@/data/finansije.json";
import vozilaData from "@/data/vozila.json";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Period = "week" | "month" | "year";

interface VehicleStats {
  naziv: string;
  prihodi: number;
  rashodi: number;
  profit: number;
  marza: number;
  status: string;
}

export const VehicleProfitability = () => {
  const [period, setPeriod] = useState<Period>("month");

  const getDateRange = (period: Period) => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return startDate;
  };

  const vehicleStats = useMemo(() => {
    const startDate = getDateRange(period);
    const stats = new Map<string, VehicleStats>();

    // Initialize stats for all vehicles
    vozilaData.forEach((vozilo) => {
      stats.set(vozilo.naziv, {
        naziv: vozilo.naziv,
        prihodi: 0,
        rashodi: 0,
        profit: 0,
        marza: 0,
        status: vozilo.status,
      });
    });

    // Calculate income and expenses per vehicle
    finansijeData.forEach((transakcija) => {
      const transakcijaDate = new Date(transakcija.datum);
      if (transakcijaDate >= startDate) {
        const voziloNaziv = transakcija.vozilo;

        if (voziloNaziv === "Svi") {
          // Distribute evenly across all active vehicles
          const activeVehicles = vozilaData.filter((v) => v.status === "aktivan");
          const perVehicle = transakcija.iznos / activeVehicles.length;

          activeVehicles.forEach((vozilo) => {
            const stat = stats.get(vozilo.naziv);
            if (stat) {
              if (transakcija.tip === "prihod") {
                stat.prihodi += perVehicle;
              } else {
                stat.rashodi += perVehicle;
              }
            }
          });
        } else {
          const stat = stats.get(voziloNaziv);
          if (stat) {
            if (transakcija.tip === "prihod") {
              stat.prihodi += transakcija.iznos;
            } else {
              stat.rashodi += transakcija.iznos;
            }
          }
        }
      }
    });

    // Calculate profit and margin
    stats.forEach((stat) => {
      stat.profit = stat.prihodi - stat.rashodi;
      stat.marza = stat.prihodi > 0 ? (stat.profit / stat.prihodi) * 100 : 0;
    });

    return Array.from(stats.values()).sort((a, b) => b.profit - a.profit);
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Nedeljni izveštaj";
      case "month":
        return "Mesečni izveštaj";
      case "year":
        return "Godišnji izveštaj";
    }
  };

  const totalProfit = vehicleStats.reduce((sum, v) => sum + v.profit, 0);
  const totalIncome = vehicleStats.reduce((sum, v) => sum + v.prihodi, 0);
  const totalExpenses = vehicleStats.reduce((sum, v) => sum + v.rashodi, 0);
  const profitableVehicles = vehicleStats.filter((v) => v.profit > 0).length;

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl">Analiza profitabilnosti vozila</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getPeriodLabel()} - Proverite isplativost svakog vozila
              </p>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList>
                <TabsTrigger value="week">Nedelja</TabsTrigger>
                <TabsTrigger value="month">Mesec</TabsTrigger>
                <TabsTrigger value="year">Godina</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/10"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Ukupan profit
              </div>
              <div className={cn(
                "text-2xl font-bold",
                totalProfit >= 0 ? "text-success" : "text-destructive"
              )}>
                {formatCurrency(totalProfit)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-success/5 border border-success/10"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                Ukupni prihodi
              </div>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalIncome)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-destructive/5 border border-destructive/10"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingDown className="h-4 w-4" />
                Ukupni rashodi
              </div>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-accent/5 border border-accent/10"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertCircle className="h-4 w-4" />
                Profitabilna vozila
              </div>
              <div className="text-2xl font-bold text-accent">
                {profitableVehicles} / {vehicleStats.length}
              </div>
            </motion.div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vozilo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Prihodi</TableHead>
                  <TableHead className="text-right">Rashodi</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Marža</TableHead>
                  <TableHead className="text-center">Ocena</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleStats.map((stat, index) => {
                  const isProfitable = stat.profit > 0;
                  const isHighMargin = stat.marza > 50;
                  const isLowMargin = stat.marza < 20 && stat.marza > 0;
                  const isLoss = stat.profit < 0;

                  let ocena = "Odlično";
                  let ocenaColor = "default";

                  if (isLoss) {
                    ocena = "Gubitak";
                    ocenaColor = "destructive";
                  } else if (isLowMargin) {
                    ocena = "Slaba";
                    ocenaColor = "secondary";
                  } else if (isHighMargin) {
                    ocena = "Izvrsno";
                    ocenaColor = "default";
                  } else if (isProfitable) {
                    ocena = "Dobro";
                    ocenaColor = "secondary";
                  }

                  return (
                    <motion.tr
                      key={stat.naziv}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{stat.naziv}</TableCell>
                      <TableCell>
                        <Badge variant={stat.status === "aktivan" ? "default" : "secondary"}>
                          {stat.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-success font-medium">
                        {formatCurrency(stat.prihodi)}
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">
                        {formatCurrency(stat.rashodi)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-bold",
                        isProfitable ? "text-success" : "text-destructive"
                      )}>
                        {formatCurrency(stat.profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-medium",
                          isHighMargin ? "text-success" : isLowMargin ? "text-warning" : ""
                        )}>
                          {stat.marza.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={ocenaColor as any}>{ocena}</Badge>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Preporuke
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {vehicleStats.filter((v) => v.profit < 0).length > 0 && (
                <li>
                  <strong className="text-destructive">
                    Vozila sa gubitkom:
                  </strong>{" "}
                  {vehicleStats
                    .filter((v) => v.profit < 0)
                    .map((v) => v.naziv)
                    .join(", ")}{" "}
                  - Razmislite o optimizaciji troškova ili prodaji
                </li>
              )}
              {vehicleStats.filter((v) => v.marza > 0 && v.marza < 20).length > 0 && (
                <li>
                  <strong className="text-warning">
                    Vozila sa niskom maržom:
                  </strong>{" "}
                  {vehicleStats
                    .filter((v) => v.marza > 0 && v.marza < 20)
                    .map((v) => v.naziv)
                    .join(", ")}{" "}
                  - Pokušajte povećati prihode ili smanjiti rashode
                </li>
              )}
              {vehicleStats.filter((v) => v.marza > 50).length > 0 && (
                <li>
                  <strong className="text-success">
                    Najisplativija vozila:
                  </strong>{" "}
                  {vehicleStats
                    .filter((v) => v.marza > 50)
                    .map((v) => v.naziv)
                    .join(", ")}{" "}
                  - Odličan ROI, nastavite sa ovim vozilima
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
