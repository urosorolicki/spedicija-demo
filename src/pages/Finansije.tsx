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
import finansijeData from "@/data/finansije.json";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Finansije() {
  const ukupniPrihodi = finansijeData
    .filter((f) => f.tip === "prihod")
    .reduce((sum, f) => sum + f.iznos, 0);

  const ukupniRashodi = finansijeData
    .filter((f) => f.tip === "rashod")
    .reduce((sum, f) => sum + f.iznos, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Finansije</h1>
        <p className="text-muted-foreground">Prihodi i rashodi</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ukupni prihodi</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
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
              <CardTitle className="text-sm font-medium">Ukupni rashodi</CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
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
              <CardTitle className="text-sm font-medium">Neto saldo</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {(ukupniPrihodi - ukupniRashodi).toLocaleString("sr-RS")} RSD
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sve transakcije</CardTitle>
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
              {finansijeData.map((transakcija) => (
                <TableRow key={transakcija.id} className="hover:bg-muted/50">
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
                  <TableCell className="max-w-xs">{transakcija.opis}</TableCell>
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
