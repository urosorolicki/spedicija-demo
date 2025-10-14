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
import { FinansijeChart } from "@/components/FinansijeChart";
import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download, Trash2, Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/export";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Finansije() {
  const STORAGE_KEY = "markovickop_finansije";
  const [finansijeData, setFinansijeData] = useState<any[]>([]);
  const [deletingFinansija, setDeletingFinansija] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tipFilter, setTipFilter] = useState<string>("svi");
  const [kategorijaFilter, setKategorijaFilter] = useState<string>("sve");
  const [sortBy, setSortBy] = useState<string>("datum-desc");

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
    setIsAddDialogOpen(false);
  };

  const handleDelete = (finansija: any) => {
    setDeletingFinansija(finansija);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingFinansija) {
      const updatedFinansije = finansijeData.filter((f) => f.id !== deletingFinansija.id);
      setFinansijeData(updatedFinansije);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFinansije));
    }
    setIsDeleteDialogOpen(false);
    setDeletingFinansija(null);
  };

  // Get unique categories for filter
  const uniqueKategorije = useMemo(() => {
    const kategorije = [...new Set(finansijeData.map((f) => f.kategorija))];
    return kategorije.sort();
  }, [finansijeData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = [...finansijeData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((f) =>
        f.opis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.kategorija?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.vozilo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tip filter
    if (tipFilter !== "svi") {
      filtered = filtered.filter((f) => f.tip === tipFilter);
    }

    // Kategorija filter
    if (kategorijaFilter !== "sve") {
      filtered = filtered.filter((f) => f.kategorija === kategorijaFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "datum-desc":
          return new Date(b.datum).getTime() - new Date(a.datum).getTime();
        case "datum-asc":
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        case "iznos-desc":
          return b.iznos - a.iznos;
        case "iznos-asc":
          return a.iznos - b.iznos;
        default:
          return 0;
      }
    });

    return filtered;
  }, [finansijeData, searchQuery, tipFilter, kategorijaFilter, sortBy]);

  // Calculate totals from filtered data
  const ukupniPrihodi = filteredData
    .filter((f) => f.tip === "prihod")
    .reduce((sum, f) => sum + Number(f.iznos), 0);

  const ukupniRashodi = filteredData
    .filter((f) => f.tip === "rashod")
    .reduce((sum, f) => sum + Number(f.iznos), 0);

  const handleExport = (format: "json" | "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `finansije_${timestamp}`;
    
    switch (format) {
      case "json":
        exportToJSON(filteredData, filename);
        break;
      case "csv":
        exportToCSV(filteredData, filename);
        break;
      case "pdf":
        exportToPDF(filteredData, filename, "Finansije");
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

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card border-accent/20">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži po opisu, kategoriji ili vozilu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tip</label>
                  <Select value={tipFilter} onValueChange={setTipFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="svi">Svi</SelectItem>
                      <SelectItem value="prihod">Prihod</SelectItem>
                      <SelectItem value="rashod">Rashod</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Kategorija</label>
                  <Select value={kategorijaFilter} onValueChange={setKategorijaFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sve">Sve</SelectItem>
                      {uniqueKategorije.map((kat) => (
                        <SelectItem key={kat} value={kat}>
                          {kat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Sortiraj</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="datum-desc">Najnovije</SelectItem>
                      <SelectItem value="datum-asc">Najstarije</SelectItem>
                      <SelectItem value="iznos-desc">Iznos (najveći)</SelectItem>
                      <SelectItem value="iznos-asc">Iznos (najmanji)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count */}
              <p className="text-xs text-muted-foreground">
                Prikazano <span className="font-medium">{filteredData.length}</span> od {finansijeData.length} transakcija
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FinansijeChart data={finansijeData} />
      </motion.div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdi brisanje</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete ovu transakciju?
              Ova akcija se ne može poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  <TableHead className="text-xs sm:text-sm w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((transakcija) => (
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
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(transakcija)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="lg"
            onClick={() => setIsAddDialogOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </AnimatePresence>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dodaj novu transakciju</DialogTitle>
            <DialogDescription>
              Unesite detalje o novom prihodu ili rashodu
            </DialogDescription>
          </DialogHeader>
          <FinansijeForm onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
