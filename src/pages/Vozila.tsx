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
import vozilaDataJson from "@/data/vozila.json";
import { VozilaForm, VoziloData } from "@/components/VozilaForm";
import React, { useState, useEffect } from "react";
import { Truck, Calendar, Gauge, Settings, Pencil, Download } from "lucide-react";
import { motion } from "framer-motion";
import { VehicleProfitability } from "@/components/VehicleProfitability";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/export";

export default function Vozila() {
  const STORAGE_KEY = "markovickop_vozila";
  const [vozilaData, setVozilaData] = useState<any[]>([]);
  const [editingVozilo, setEditingVozilo] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVozilaData(JSON.parse(stored));
        return;
      } catch {}
    }
    setVozilaData(vozilaDataJson);
  }, []);

  const handleSave = (data: VoziloData) => {
    const id = Date.now();
    const novoVozilo = {
      ...data,
      id,
    };
    const novaVozila = [novoVozilo, ...vozilaData];
    setVozilaData(novaVozila);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaVozila));
  };

  const handleEdit = (vozilo: any) => {
    setEditingVozilo(vozilo);
    setIsDialogOpen(true);
  };

  const handleUpdate = (data: VoziloData) => {
    const updatedVozila = vozilaData.map((v) =>
      v.id === editingVozilo.id ? { ...data, id: editingVozilo.id } : v
    );
    setVozilaData(updatedVozila);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVozila));
    setIsDialogOpen(false);
    setEditingVozilo(null);
  };

  const handleCancelEdit = () => {
    setIsDialogOpen(false);
    setEditingVozilo(null);
  };

  const handleExport = (format: "json" | "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `vozila_${timestamp}`;
    
    switch (format) {
      case "json":
        exportToJSON(vozilaData, filename);
        break;
      case "csv":
        exportToCSV(vozilaData, filename);
        break;
      case "pdf":
        exportToPDF(vozilaData, filename, "Vozila");
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
      <VozilaForm onSave={handleSave} />
      <VehicleProfitability />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vozilaData.map((vozilo, index) => (
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 md:space-y-3 pt-2 sm:pt-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Tip:</span>
                  <span className="font-medium truncate">{vozilo.tip}</span>
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
    </div>
  );
}
