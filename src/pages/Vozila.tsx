import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VozilaForm, VoziloData } from "@/components/VozilaForm";
import { VehicleNotifications } from "@/components/VehicleNotifications";
import React, { useState, useEffect, useMemo } from "react";
import { Truck, Calendar, Gauge, Settings, Pencil, Download, Trash2, Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleProfitability } from "@/components/VehicleProfitability";
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
import { useAuth } from "@/contexts/AuthContext";
import { getVozila, createVozilo, updateVozilo, deleteVozilo } from "@/services/vozilaService";
import { getFinansije } from "@/services/finansijeService";

export default function Vozila() {
  const { user } = useAuth();
  const [vozilaData, setVozilaData] = useState<any[]>([]);
  const [finansijeData, setFinansijeData] = useState<any[]>([]);
  const [editingVozilo, setEditingVozilo] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deletingVozilo, setDeletingVozilo] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tipFilter, setTipFilter] = useState<string>("svi");
  const [statusFilter, setStatusFilter] = useState<string>("svi");
  const [sortBy, setSortBy] = useState<string>("naziv");

  useEffect(() => {
    if (user) {
      loadVozila();
    }
  }, [user]);

  const loadVozila = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const [vozilaResult, finansijeResult] = await Promise.all([
      getVozila(user.id),
      getFinansije(user.id),
    ]);
    
    if (vozilaResult.success && vozilaResult.vozila) {
      setVozilaData(vozilaResult.vozila);
    }
    
    if (finansijeResult.success && finansijeResult.finansije) {
      setFinansijeData(finansijeResult.finansije);
    }
    
    setIsLoading(false);
  };

  const handleSave = async (data: VoziloData) => {
    if (!user) return;
    
    const result = await createVozilo(user.id, {
      naziv: data.naziv,
      registracija: data.registracija,
      tipVozila: data.tip,
      nosivost: data.nosivost,
      kilometraza: data.kilometraza,
      godiste: data.godiste,
      status: data.status,
      sledecaRevizijaGorivo: data.sledecaRevizijaGorivo,
      sledecaRegistracija: data.sledecaRegistracija,
    } as any);
    
    if (result.success) {
      await loadVozila();
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (vozilo: any) => {
    setEditingVozilo(vozilo);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: VoziloData) => {
    if (!editingVozilo) return;
    
    const result = await updateVozilo(editingVozilo.$id, {
      naziv: data.naziv,
      registracija: data.registracija,
      tipVozila: data.tip,
      nosivost: data.nosivost,
      kilometraza: data.kilometraza,
      godiste: data.godiste,
      status: data.status,
      sledecaRevizijaGorivo: data.sledecaRevizijaGorivo,
      sledecaRegistracija: data.sledecaRegistracija,
    } as any);
    
    if (result.success) {
      await loadVozila();
      setIsEditDialogOpen(false);
      setEditingVozilo(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingVozilo(null);
  };

  const handleDelete = (vozilo: any) => {
    setDeletingVozilo(vozilo);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingVozilo) {
      const result = await deleteVozilo(deletingVozilo.$id);
      if (result.success) {
        await loadVozila();
      }
    }
    setIsDeleteDialogOpen(false);
    setDeletingVozilo(null);
  };

  // Get unique types for filter
  const uniqueTipovi = useMemo(() => {
    const tipovi = [...new Set(vozilaData.map((v) => v.tip))];
    return tipovi.sort();
  }, [vozilaData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = [...vozilaData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((v) =>
        v.naziv?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.registracija?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tip?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tip filter
    if (tipFilter !== "svi") {
      filtered = filtered.filter((v) => v.tip === tipFilter);
    }

    // Status filter
    if (statusFilter !== "svi") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "naziv":
          return a.naziv.localeCompare(b.naziv);
        case "kilometraza-desc":
          return b.kilometraza - a.kilometraza;
        case "kilometraza-asc":
          return a.kilometraza - b.kilometraza;
        case "godiste-desc":
          return b.godiste - a.godiste;
        case "godiste-asc":
          return a.godiste - b.godiste;
        default:
          return 0;
      }
    });

    return filtered;
  }, [vozilaData, searchQuery, tipFilter, statusFilter, sortBy]);

  const handleExport = (format: "json" | "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `vozila_${timestamp}`;
    
    switch (format) {
      case "json":
        exportToJSON(filteredData, filename);
        break;
      case "csv":
        exportToCSV(filteredData, filename);
        break;
      case "pdf":
        exportToPDF(filteredData, filename, "Vozila");
        break;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Vozila</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Pregled voznog parka i analize profitabilnosti</p>
        </div>
        <div className="flex items-center gap-2">
          <VehicleNotifications vozila={vozilaData} />
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
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-card border-accent/20">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži po nazivu, registraciji ili tipu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tip vozila</label>
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
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svi">Svi</SelectItem>
                    <SelectItem value="aktivan">Aktivan</SelectItem>
                    <SelectItem value="neaktivan">Neaktivan</SelectItem>
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
                    <SelectItem value="naziv">Naziv (A-Z)</SelectItem>
                    <SelectItem value="kilometraza-desc">Kilometraža (najveća)</SelectItem>
                    <SelectItem value="kilometraza-asc">Kilometraža (najmanja)</SelectItem>
                    <SelectItem value="godiste-desc">Godište (najnovije)</SelectItem>
                    <SelectItem value="godiste-asc">Godište (najstarije)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
              Prikazano <span className="font-medium">{filteredData.length}</span> od {vozilaData.length} vozila
            </p>
          </div>
        </CardContent>
      </Card>

      <VehicleProfitability vozila={vozilaData} finansije={finansijeData} />
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Izmeni vozilo</DialogTitle>
          </DialogHeader>
          {editingVozilo && (
            <VozilaForm
              editData={editingVozilo}
              onSave={handleUpdate}
              onCancel={handleCancelEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdi brisanje</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete vozilo <strong>{deletingVozilo?.naziv}</strong>?
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

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((vozilo, index) => (
          <motion.div
            key={vozilo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-lg transition-smooth">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm sm:text-base md:text-lg truncate">{vozilo.naziv}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      {vozilo.registracija}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Badge
                      variant={vozilo.status === "aktivan" ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs px-1.5 sm:px-2"
                    >
                      {vozilo.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(vozilo)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(vozilo)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 md:space-y-3 pt-2 sm:pt-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Tip:</span>
                  <span className="font-medium truncate">{vozilo.tipVozila}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Nosivost:</span>
                  <span className="font-medium">{vozilo.nosivost}t</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Kilometraža:</span>
                  <span className="font-medium">
                    {vozilo.kilometraza.toLocaleString("sr-RS")} km
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Godište:</span>
                  <span className="font-medium">{vozilo.godiste}</span>
                </div>
                <div className="pt-1.5 sm:pt-2 md:pt-3 border-t space-y-0.5 sm:space-y-1 md:space-y-2">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Registracija:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(vozilo.sledecaRegistracija).toLocaleDateString("sr-RS")}
                    </span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Revizija goriva:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(vozilo.sledecaRevizijaGorivo).toLocaleDateString("sr-RS")}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
            <DialogTitle>Dodaj novo vozilo</DialogTitle>
          </DialogHeader>
          <VozilaForm onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
