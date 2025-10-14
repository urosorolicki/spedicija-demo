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

interface VehicleProfitabilityProps {
  vozila: any[];
  finansije: any[];
}

export const VehicleProfitability = ({ vozila = [], finansije = [] }: VehicleProfitabilityProps) => {
  const [period, setPeriod] = useState<Period>("month");

  const getDateRange = (period: Period) => {
    // Koristimo trenutni datum za pravu automatizaciju
    const now = new Date();
    const startDate = new Date(now);

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
    const now = new Date(); // Trenutni datum
    const stats = new Map<string, VehicleStats>();

    // Initialize stats for all vehicles
    vozila.forEach((vozilo) => {
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
    finansije.forEach((transakcija) => {
      const transakcijaDate = new Date(transakcija.datum);
      // Proveravamo da li je transakcija u opsegu datuma za izabrani period
      if (transakcijaDate >= startDate && transakcijaDate <= now) {
        const voziloNaziv = transakcija.vozilo;

        if (voziloNaziv === "Svi") {
          // Distribute evenly across all active vehicles
          const activeVehicles = vozila.filter((v) => v.status === "aktivan");
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
  }, [period, vozila, finansije]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodLabel = () => {
    const now = new Date();
    const startDate = getDateRange(period);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("sr-RS", { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    };

    switch (period) {
      case "week":
        return `Nedeljni izveštaj (${formatDate(startDate)} - ${formatDate(now)})`;
      case "month":
        return `Mesečni izveštaj (${formatDate(startDate)} - ${formatDate(now)})`;
      case "year":
        return `Godišnji izveštaj (${formatDate(startDate)} - ${formatDate(now)})`;
    }
  };

  const totalProfit = vehicleStats.reduce((sum, v) => sum + v.profit, 0);
  const totalIncome = vehicleStats.reduce((sum, v) => sum + v.prihodi, 0);
  const totalExpenses = vehicleStats.reduce((sum, v) => sum + v.rashodi, 0);
  const profitableVehicles = vehicleStats.filter((v) => v.profit > 0).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Analiza profitabilnosti vozila</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {getPeriodLabel()} - Proverite isplativost svakog vozila
              </p>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="week" className="text-xs sm:text-sm">Nedelja</TabsTrigger>
                <TabsTrigger value="month" className="text-xs sm:text-sm">Mesec</TabsTrigger>
                <TabsTrigger value="year" className="text-xs sm:text-sm">Godina</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                Ukupan profit
              </div>
              <div className={cn(
                "text-lg sm:text-2xl font-bold",
                totalProfit >= 0 ? "text-success" : "text-destructive"
              )}>
                {formatCurrency(totalProfit)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 sm:p-4 rounded-lg bg-success/5 border border-success/10"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Ukupni prihodi
              </div>
              <div className="text-lg sm:text-2xl font-bold text-success">
                {formatCurrency(totalIncome)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 sm:p-4 rounded-lg bg-destructive/5 border border-destructive/10"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                Ukupni rashodi
              </div>
              <div className="text-lg sm:text-2xl font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-3 sm:p-4 rounded-lg bg-accent/5 border border-accent/10"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                Profitabilna vozila
              </div>
              <div className="text-lg sm:text-2xl font-bold text-accent">
                {profitableVehicles} / {vehicleStats.length}
              </div>
            </motion.div>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Vozilo</TableHead>
                    <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Prihodi</TableHead>
                    <TableHead className="hidden md:table-cell text-right text-xs sm:text-sm">Rashodi</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Profit</TableHead>
                    <TableHead className="hidden lg:table-cell text-right text-xs sm:text-sm">Marža</TableHead>
                    <TableHead className="hidden sm:table-cell text-center text-xs sm:text-sm">Ocena</TableHead>
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
                        <TableCell className="font-medium text-xs sm:text-sm">{stat.naziv}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={stat.status === "aktivan" ? "default" : "secondary"} className="text-xs">
                            {stat.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-success font-medium text-xs sm:text-sm">
                          {formatCurrency(stat.prihodi)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right text-destructive font-medium text-xs sm:text-sm">
                          {formatCurrency(stat.rashodi)}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-bold text-xs sm:text-sm",
                          isProfitable ? "text-success" : "text-destructive"
                        )}>
                          {formatCurrency(stat.profit)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right text-xs sm:text-sm">
                          <span className={cn(
                            "font-medium",
                            isHighMargin ? "text-success" : isLowMargin ? "text-warning" : ""
                          )}>
                            {stat.marza.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center">
                          <Badge variant={ocenaColor as any} className="text-xs">{ocena}</Badge>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              Preporuke
            </h4>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 list-disc list-inside">
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
