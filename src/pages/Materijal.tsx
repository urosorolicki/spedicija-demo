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
import { MaterijalForm, MaterijalData } from "@/components/MaterijalForm";
import { MaterijalChart } from "@/components/MaterijalChart";
import React, { useState, useEffect, useMemo } from "react";
import { Package, ArrowUp, ArrowDown, Download, Trash2, Search, Plus, Edit } from "lucide-react";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/export";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/contexts/AuthContext";
import { getMaterijali, createMaterijal, updateMaterijal, deleteMaterijal } from "../services/apiWrapper.localStorage";
import { getVozila } from "../services/apiWrapper.localStorage";

export default function Materijal() {
  const { user } = useAuth();
  const [materijalData, setMaterijalData] = useState<any[]>([]);
  const [vozilaData, setVozilaData] = useState<any[]>([]);
  const [deletingMaterijal, setDeletingMaterijal] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterijal, setEditingMaterijal] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [smerFilter, setSmerFilter] = useState<string>("svi");
  const [tipFilter, setTipFilter] = useState<string>("svi");
  const [sortBy, setSortBy] = useState<string>("datum-desc");

  useEffect(() => {
    if (user) {
      loadMaterijali();
      loadVozila();
    }
  }, [user]);

  const loadMaterijali = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const result = await getMaterijali();
    if (result.success && result.data) {
      setMaterijalData(result.data);
    }
    setIsLoading(false);
  };

  const loadVozila = async () => {
    if (!user) return;
    
    const result = await getVozila();
    if (result.success && result.data) {
      setVozilaData(result.data);
    }
  };

  const handleSave = async (data: MaterijalData) => {
    if (!user) return;
    
    const result = await createMaterijal({
      datum: data.datum,
      tip: data.smer as 'ulaz' | 'izlaz',
      materijal: data.tip,
      tezina: data.kolicina,
      jedinica: data.jedinica,
      lokacija: data.lokacija,
      vozac: data.vozac,
      vozilo: data.vozilo,
      imageId: data.imageId,
    } as any);
    
    if (result.success) {
      await loadMaterijali();
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (materijal: any) => {
    setEditingMaterijal(materijal);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: MaterijalData) => {
    if (!editingMaterijal) return;
    
    const result = await updateMaterijal(editingMaterijal.id, {
      datum: data.datum,
      tip: data.smer as 'ulaz' | 'izlaz',
      materijal: data.tip,
      tezina: data.kolicina,
      jedinica: data.jedinica,
      lokacija: data.lokacija,
      vozac: data.vozac,
      vozilo: data.vozilo,
      imageId: data.imageId,
    } as any);
    
    if (result.success) {
      await loadMaterijali();
      setIsEditDialogOpen(false);
      setEditingMaterijal(null);
    }
  };

  const handleDelete = (materijal: any) => {
    setDeletingMaterijal(materijal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingMaterijal) {
      const result = await deleteMaterijal(deletingMaterijal.id);
      if (result.success) {
        await loadMaterijali();
      }
    }
    setIsDeleteDialogOpen(false);
    setDeletingMaterijal(null);
  };

  // Get unique material types for filter
  const uniqueTipovi = useMemo(() => {
    const tipovi = [...new Set(materijalData.map((m) => m.materijal))];
    return tipovi.sort();
  }, [materijalData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = [...materijalData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((m) =>
        m.materijal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.lokacija?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.vozac?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.vozilo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Smer filter (tip u bazi = ulaz/izlaz)
    if (smerFilter !== "svi") {
      filtered = filtered.filter((m) => m.tip === smerFilter);
    }

    // Tip filter (materijal u bazi = Pesak/Šljunak)
    if (tipFilter !== "svi") {
      filtered = filtered.filter((m) => m.materijal === tipFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "datum-desc":
          return new Date(b.datum).getTime() - new Date(a.datum).getTime();
        case "datum-asc":
          return new Date(a.datum).getTime() - new Date(b.datum).getTime();
        case "kolicina-desc":
          return b.tezina - a.tezina;
        case "kolicina-asc":
          return a.tezina - b.tezina;
        default:
          return 0;
      }
    });

    return filtered;
  }, [materijalData, searchQuery, smerFilter, tipFilter, sortBy]);

  // Calculate totals from filtered data by unit
  const ulazPoJedinici = filteredData
    .filter((m) => m.tip === "ulaz")
    .reduce((acc, m) => {
      const jedinica = m.jedinica || "m³";
      acc[jedinica] = (acc[jedinica] || 0) + Number(m.tezina);
      return acc;
    }, {} as Record<string, number>);

  const izlazPoJedinici = filteredData
    .filter((m) => m.tip === "izlaz")
    .reduce((acc, m) => {
      const jedinica = m.jedinica || "m³";
      acc[jedinica] = (acc[jedinica] || 0) + Number(m.tezina);
      return acc;
    }, {} as Record<string, number>);

  // Format totals for display
  const formatTotals = (totals: Record<string, number>) => {
    const entries = Object.entries(totals);
    if (entries.length === 0) return "0";
    return entries.map(([unit, value]) => `${value.toFixed(2)} ${unit}`).join(" | ");
  };

  const handleExport = (format: "json" | "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `materijal_${timestamp}`;
    
    switch (format) {
      case "json":
        exportToJSON(filteredData, filename);
        break;
      case "csv":
        exportToCSV(filteredData, filename);
        break;
      case "pdf":
        exportToPDF(filteredData, filename, "Materijal");
        break;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Evidencija materijala</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Pregled ulaza i izlaza materijala</p>
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

      {/* Search and Filter Section */}
      <Card className="shadow-card border-accent/20">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži po tipu, lokaciji, vozaču ili vozilu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Smer</label>
                <Select value={smerFilter} onValueChange={setSmerFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svi">Svi</SelectItem>
                    <SelectItem value="ulaz">Ulaz</SelectItem>
                    <SelectItem value="izlaz">Izlaz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tip materijala</label>
                <Select value={tipFilter} onValueChange={setTipFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svi">Svi</SelectItem>
                    {uniqueTipovi.map((tip) => (
                      <SelectItem key={tip} value={tip}>
                        {tip}
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
                    <SelectItem value="kolicina-desc">Količina (najveća)</SelectItem>
                    <SelectItem value="kolicina-asc">Količina (najmanja)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
              Prikazano <span className="font-medium">{filteredData.length}</span> od {materijalData.length} unosa
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupan ulaz</CardTitle>
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-primary">{formatTotals(ulazPoJedinici)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupan izlaz</CardTitle>
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-accent">{formatTotals(izlazPoJedinici)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupno unosa</CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {filteredData.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <MaterijalChart data={materijalData} />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdi brisanje</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete ovaj unos materijala?
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
          <CardTitle className="text-lg">Svi unosi</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile View - Cards */}
          <div className="block sm:hidden space-y-3 p-4">
            {filteredData.map((unos) => (
              <motion.div
                key={unos.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-lg p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-semibold text-base">{unos.tip}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(unos.datum).toLocaleDateString("sr-RS")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(unos)}
                      className="h-8 w-8 p-0 text-primary hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(unos)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={unos.tip === "ulaz" ? "default" : "secondary"}>
                    {unos.tip === "ulaz" ? (
                      <span className="flex items-center gap-1">
                        <ArrowDown className="h-3 w-3" /> Ulaz
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3" /> Izlaz
                      </span>
                    )}
                  </Badge>
                  <span className="text-lg font-bold">
                    {unos.tezina} {unos.jedinica}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                  <div>
                    <div className="text-muted-foreground text-xs">Vozilo</div>
                    <div className="font-medium">{unos.vozilo}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Vozač</div>
                    <div className="font-medium">{unos.vozac}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground text-xs">Lokacija</div>
                    <div className="font-medium truncate">{unos.lokacija}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Datum</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tip materijala</TableHead>
                  <TableHead className="text-xs sm:text-sm">Količina</TableHead>
                  <TableHead className="text-xs sm:text-sm">Smer</TableHead>
                  <TableHead className="text-xs sm:text-sm">Vozilo</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Vozač</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Lokacija</TableHead>
                  <TableHead className="text-xs sm:text-sm w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((unos) => (
                  <TableRow key={unos.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {new Date(unos.datum).toLocaleDateString("sr-RS")}
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{unos.materijal}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {unos.tezina} {unos.jedinica}
                    </TableCell>
                    <TableCell>
                      <Badge variant={unos.tip === "ulaz" ? "default" : "secondary"} className="text-xs">
                        {unos.tip === "ulaz" ? (
                          <span className="flex items-center gap-1">
                            <ArrowDown className="h-3 w-3" /> Ulaz
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ArrowUp className="h-3 w-3" /> Izlaz
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{unos.vozilo}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{unos.vozac}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-xs sm:text-sm">{unos.lokacija}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(unos)}
                          className="h-7 w-7 p-0 text-primary hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(unos)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <DialogTitle>Dodaj novi unos materijala</DialogTitle>
            <DialogDescription>
              Unesite detalje o ulazu ili izlazu materijala
            </DialogDescription>
          </DialogHeader>
          <MaterijalForm onSave={handleSave} vozila={vozilaData} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Izmeni unos materijala</DialogTitle>
            <DialogDescription>
              Ažurirajte detalje o ulazu ili izlazu materijala
            </DialogDescription>
          </DialogHeader>
          <MaterijalForm onSave={handleUpdate} initialData={editingMaterijal} vozila={vozilaData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
