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
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Evidencija materijala</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Pregled dovoza i odvoza materijala</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupan dovoz</CardTitle>
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-primary">{ukupanDovoz} m³</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupan odvoz</CardTitle>
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-accent">{ukupanOdvoz} m³</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ukupno unosa</CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {materijalData.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Svi unosi</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Datum</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tip materijala</TableHead>
                  <TableHead className="text-xs sm:text-sm">Količina</TableHead>
                  <TableHead className="text-xs sm:text-sm">Smer</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Vozilo</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Vozač</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Lokacija</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materijalData.map((unos) => (
                  <TableRow key={unos.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {new Date(unos.datum).toLocaleDateString("sr-RS")}
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{unos.tip}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {unos.kolicina} {unos.jedinica}
                    </TableCell>
                    <TableCell>
                      <Badge variant={unos.smer === "dovoz" ? "default" : "secondary"} className="text-xs">
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
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{unos.vozilo}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{unos.vozac}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-xs sm:text-sm">{unos.lokacija}</TableCell>
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
