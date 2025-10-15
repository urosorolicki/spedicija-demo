import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

interface MaterijalFormProps {
  onSave: (data: MaterijalData) => void;
  initialData?: any;
  vozila?: any[];
}

export interface MaterijalData {
  datum: string;
  tip: string;
  kolicina: number;
  jedinica: string;
  lokacija: string;
  vozac: string;
  vozilo: string;
  smer: string;
  imageId?: string;
}

const jedinice = ["kg", "t", "l", "m³"];
const tipovi = ["Šljunak", "Pesak", "Kamen", "Agregat"];
const smerovi = ["ulaz", "izlaz"];

export const MaterijalForm: React.FC<MaterijalFormProps> = ({ onSave, initialData, vozila = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<MaterijalData>({
    datum: initialData?.datum || "",
    tip: initialData?.tip || tipovi[0],
    kolicina: initialData?.kolicina || 0,
    jedinica: initialData?.jedinica || jedinice[0],
    lokacija: initialData?.lokacija || "",
    vozac: initialData?.vozac || "",
    vozilo: initialData?.vozilo || "",
    smer: initialData?.smer || smerovi[0],
    imageId: initialData?.imageId || undefined,
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.datum || !form.tip || !form.kolicina || !form.jedinica || !form.lokacija || !form.vozac || !form.vozilo || !form.smer) {
      setError("Sva polja su obavezna.");
      return;
    }
    setError("");
    onSave({
      ...form,
      kolicina: Number(form.kolicina)
    });
    setForm({
      datum: "",
      tip: tipovi[0],
      kolicina: 0,
      jedinica: jedinice[0],
      lokacija: "",
      vozac: "",
      vozilo: "",
      smer: smerovi[0],
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="mb-6 shadow-card cursor-pointer hover:shadow-lg transition-all" onClick={() => setIsOpen(true)}>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Dodaj novi unos materijala</CardTitle>
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
          <CardTitle className="text-base">Dodaj novi unos materijala</CardTitle>
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
                <Label htmlFor="tip">Tip materijala</Label>
                <select name="tip" id="tip" value={form.tip} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {tipovi.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kolicina">Količina</Label>
                <Input type="number" name="kolicina" id="kolicina" value={form.kolicina} onChange={handleChange} min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jedinica">Jedinica</Label>
                <select name="jedinica" id="jedinica" value={form.jedinica} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {jedinice.map((j) => (<option key={j} value={j}>{j}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smer">Smer</Label>
                <select name="smer" id="smer" value={form.smer} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {smerovi.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokacija">Lokacija</Label>
                <Input type="text" name="lokacija" id="lokacija" value={form.lokacija} onChange={handleChange} placeholder="Lokacija" />
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Transport</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vozac">Vozač</Label>
                <Input type="text" name="vozac" id="vozac" value={form.vozac} onChange={handleChange} placeholder="Vozač" />
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
                  {vozila.map((vozilo) => (
                    <option key={vozilo.$id} value={vozilo.naziv}>
                      {vozilo.naziv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Slika tereta */}
          <div className="space-y-4">
            <ImageUpload
              value={form.imageId}
              onChange={(fileId) => setForm({ ...form, imageId: fileId || undefined })}
              label="Slika tereta/materijala"
              maxSizeMB={5}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">Sačuvaj</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
