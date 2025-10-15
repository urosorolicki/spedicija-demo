import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FinansijeFormProps {
  onSave: (data: FinansijeData) => void;
  initialData?: any;
  vozila?: any[];
}

export interface FinansijeData {
  datum: string;
  tip: string;
  kategorija: string;
  iznos: number;
  opis: string;
  komentar: string;
  vozilo: string;
}

const tipovi = ["prihod", "rashod"];
const kategorije = ["Prevoz", "Gorivo", "Održavanje", "Investicija"];

export const FinansijeForm: React.FC<FinansijeFormProps> = ({ onSave, initialData, vozila = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FinansijeData>({
    datum: initialData?.datum || "",
    tip: initialData?.tip || tipovi[0],
    kategorija: initialData?.kategorija || kategorije[0],
    iznos: initialData?.iznos || 0,
    opis: initialData?.opis || "",
    komentar: initialData?.komentar || "",
    vozilo: initialData?.vozilo || "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.datum || !form.tip || !form.kategorija || !form.iznos || !form.opis || !form.vozilo) {
      setError("Sva polja su obavezna.");
      return;
    }
    setError("");
    onSave({
      ...form,
      iznos: Number(form.iznos)
    });
    setForm({
      datum: "",
      tip: tipovi[0],
      kategorija: kategorije[0],
      iznos: 0,
      opis: "",
      komentar: "",
      vozilo: "",
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="mb-6 shadow-card cursor-pointer hover:shadow-lg transition-all" onClick={() => setIsOpen(true)}>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Dodaj novu finansijsku transakciju</CardTitle>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-card">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Dodaj novu finansijsku transakciju</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}
          
          {/* Osnovni podaci */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Osnovni podaci</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datum">Datum</Label>
                <Input type="date" name="datum" id="datum" value={form.datum} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip">Tip</Label>
                <select name="tip" id="tip" value={form.tip} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {tipovi.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategorija">Kategorija</Label>
                <select name="kategorija" id="kategorija" value={form.kategorija} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {kategorije.map((k) => (<option key={k} value={k}>{k}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="iznos">Iznos (RSD)</Label>
                <Input type="number" name="iznos" id="iznos" value={form.iznos} onChange={handleChange} min={0} placeholder="Iznos u RSD" />
              </div>
            </div>
          </div>

          {/* Detalji */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Detalji</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opis">Opis</Label>
                <Input type="text" name="opis" id="opis" value={form.opis} onChange={handleChange} placeholder="Opis transakcije" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="komentar">Komentar</Label>
                <Input type="text" name="komentar" id="komentar" value={form.komentar} onChange={handleChange} placeholder="Dodatni komentar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vozilo">Vozilo</Label>
                <select 
                  name="vozilo" 
                  id="vozilo" 
                  value={form.vozilo} 
                  onChange={handleChange} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Izaberi vozilo</option>
                  <option value="Svi">Svi</option>
                  {vozila.map((vozilo) => (
                    <option key={vozilo.$id} value={vozilo.naziv}>
                      {vozilo.naziv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">Sačuvaj</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
