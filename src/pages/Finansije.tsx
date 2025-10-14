import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import finansijeDataJson from "@/data/finansije.json";
import { FinansijeForm, FinansijeData } from "@/components/FinansijeForm";
import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { motion } from "framer-motion";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/export";

export default function Finansije() {
  const STORAGE_KEY = "markovickop_finansije";
  const [finansijeData, setFinansijeData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFinansijeData(JSON.parse(stored));
        return;
      } catch {}
    }
    setFinansijeData(finansijeDataJson);
  }, []);

  const handleSave = (data: FinansijeData) => {
    // Dodajemo tip i id (možeš proširiti formu po potrebi)
    const tip = data.kategorija === "Prihod" ? "prihod" : "rashod";
    const id = Date.now();
    const novaTransakcija = { ...data, tip, id };
    const noveFinansije = [novaTransakcija, ...finansijeData];
    setFinansijeData(noveFinansije);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noveFinansije));
  };

  const ukupniPrihodi = finansijeData
    .filter((f) => f.tip === "prihod")
    .reduce((sum, f) => sum + Number(f.iznos), 0);

  const ukupniRashodi = finansijeData
    .filter((f) => f.tip === "rashod")
    .reduce((sum, f) => sum + Number(f.iznos), 0);

  const handleExport = (format: "json" | "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `finansije_${timestamp}`;
    
    switch (format) {
      case "json":
        exportToJSON(finansijeData, filename);
        break;
      case "csv":
        exportToCSV(finansijeData, filename);
        break;
      case "pdf":
        exportToPDF(finansijeData, filename, "Finansije");
        break;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Finansije</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Prihodi i rashodi</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("json")}>
              Preuzmi JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              Preuzmi CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              Preuzmi PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <FinansijeForm onSave={handleSave} />

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ukupni prihodi</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-success">
                {ukupniPrihodi.toLocaleString("sr-RS")} RSD
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ukupni rashodi</CardTitle>
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-destructive">
                {ukupniRashodi.toLocaleString("sr-RS")} RSD
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Neto saldo</CardTitle>
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-accent">
                {(ukupniPrihodi - ukupniRashodi).toLocaleString("sr-RS")} RSD
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Sve transakcije</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Datum</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tip</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Kategorija</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Opis</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Vozilo</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Iznos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finansijeData.map((transakcija) => (
                  <TableRow key={transakcija.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {new Date(transakcija.datum).toLocaleDateString("sr-RS")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transakcija.tip === "prihod" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {transakcija.tip}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{transakcija.kategorija}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs text-xs sm:text-sm">{transakcija.opis}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{transakcija.vozilo}</TableCell>
                    <TableCell
                      className={`text-right font-semibold text-xs sm:text-sm ${
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
