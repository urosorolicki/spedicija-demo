import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import vozilaData from "@/data/vozila.json";
import { Truck, Calendar, Gauge, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { VehicleProfitability } from "@/components/VehicleProfitability";

export default function Vozila() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Vozila</h1>
        <p className="text-muted-foreground">Pregled voznog parka i analize profitabilnosti</p>
      </div>

      <VehicleProfitability />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vozilaData.map((vozilo, index) => (
          <motion.div
            key={vozilo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-lg transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{vozilo.naziv}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vozilo.registracija}
                    </p>
                  </div>
                  <Badge
                    variant={vozilo.status === "aktivan" ? "default" : "secondary"}
                  >
                    {vozilo.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Tip:</span>
                  <span className="font-medium">{vozilo.tip}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Nosivost:</span>
                  <span className="font-medium">{vozilo.nosivost}t</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Kilometraža:</span>
                  <span className="font-medium">
                    {vozilo.kilometraza.toLocaleString("sr-RS")} km
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Godište:</span>
                  <span className="font-medium">{vozilo.godiste}</span>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Registracija:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(vozilo.sledecaRegistracija).toLocaleDateString("sr-RS")}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
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
