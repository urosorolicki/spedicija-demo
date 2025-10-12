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
import materijalData from "@/data/materijal.json";
import { Package, ArrowUp, ArrowDown } from "lucide-react";

export default function Materijal() {
  const ukupanDovoz = materijalData
    .filter((m) => m.smer === "dovoz")
    .reduce((sum, m) => sum + m.kolicina, 0);

  const ukupanOdvoz = materijalData
    .filter((m) => m.smer === "odvoz")
    .reduce((sum, m) => sum + m.kolicina, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Evidencija materijala</h1>
        <p className="text-muted-foreground">Pregled dovoza i odvoza materijala</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ukupan dovoz</CardTitle>
            <ArrowDown className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{ukupanDovoz} m³</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ukupan odvoz</CardTitle>
            <ArrowUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{ukupanOdvoz} m³</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ukupno unosa</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {materijalData.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Svi unosi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Tip materijala</TableHead>
                <TableHead>Količina</TableHead>
                <TableHead>Smer</TableHead>
                <TableHead>Vozilo</TableHead>
                <TableHead>Vozač</TableHead>
                <TableHead>Lokacija</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materijalData.map((unos) => (
                <TableRow key={unos.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {new Date(unos.datum).toLocaleDateString("sr-RS")}
                  </TableCell>
                  <TableCell className="font-medium">{unos.tip}</TableCell>
                  <TableCell>
                    {unos.kolicina} {unos.jedinica}
                  </TableCell>
                  <TableCell>
                    <Badge variant={unos.smer === "dovoz" ? "default" : "secondary"}>
                      {unos.smer === "dovoz" ? (
                        <span className="flex items-center gap-1">
                          <ArrowDown className="h-3 w-3" /> Dovoz
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3 w-3" /> Odvoz
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{unos.vozilo}</TableCell>
                  <TableCell>{unos.vozac}</TableCell>
                  <TableCell className="max-w-xs truncate">{unos.lokacija}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
