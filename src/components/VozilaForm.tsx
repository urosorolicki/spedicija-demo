import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface VoziloFormProps {
  onSave: (data: VoziloData) => void;
  editData?: VoziloData & { id: number };
  onCancel?: () => void;
}

export interface VoziloData {
  naziv: string;
  tip: string;
  nosivost: number;
  registracija: string;
  kilometraza: number;
  godiste: number;
  status: string;
  sledecaRegistracija: string;
  sledecaRevizijaGorivo: string;
}

const statusi = ["aktivan", "neaktivan", "servis"];
const tipovi = ["Kiper kamion", "Tegljač", "Mixer", "Specijalno vozilo"];

export const VozilaForm: React.FC<VoziloFormProps> = ({ onSave, editData, onCancel }) => {
  const [isOpen, setIsOpen] = useState(!!editData);
  const [form, setForm] = useState<VoziloData>(
    editData || {
      naziv: "",
      tip: tipovi[0],
      nosivost: 0,
      registracija: "",
      kilometraza: 0,
      godiste: new Date().getFullYear(),
      status: statusi[0],
      sledecaRegistracija: "",
      sledecaRevizijaGorivo: "",
    }
  );
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.naziv || !form.tip || !form.nosivost || !form.registracija || !form.kilometraza || !form.godiste || !form.status || !form.sledecaRegistracija || !form.sledecaRevizijaGorivo) {
      setError("Sva polja su obavezna.");
      return;
    }
    setError("");
    onSave({
      ...form,
      nosivost: Number(form.nosivost),
      kilometraza: Number(form.kilometraza),
      godiste: Number(form.godiste)
    });
    if (!editData) {
      setForm({
        naziv: "",
        tip: tipovi[0],
        nosivost: 0,
        registracija: "",
        kilometraza: 0,
        godiste: new Date().getFullYear(),
        status: statusi[0],
        sledecaRegistracija: "",
        sledecaRevizijaGorivo: "",
      });
      setIsOpen(false);
    }
  };

  if (!editData && !isOpen) {
    return (
      <Card className="mb-6 shadow-card cursor-pointer hover:shadow-lg transition-all" onClick={() => setIsOpen(true)}>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Dodaj novo vozilo</CardTitle>
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
          <CardTitle className="text-base">{editData ? "Izmeni vozilo" : "Dodaj novo vozilo"}</CardTitle>
          {!editData && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}
          
          {/* Osnovne informacije */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Osnovne informacije</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="naziv">Naziv vozila</Label>
                <Input type="text" name="naziv" id="naziv" value={form.naziv} onChange={handleChange} placeholder="Naziv vozila" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip">Tip</Label>
                <select name="tip" id="tip" value={form.tip} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {tipovi.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registracija">Registracija</Label>
                <Input type="text" name="registracija" id="registracija" value={form.registracija} onChange={handleChange} placeholder="BG-123-AB" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select name="status" id="status" value={form.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {statusi.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </div>

          {/* Tehnički podaci */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Tehnički podaci</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nosivost">Nosivost (t)</Label>
                <Input type="number" name="nosivost" id="nosivost" value={form.nosivost} onChange={handleChange} min={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kilometraza">Kilometraža</Label>
                <Input type="number" name="kilometraza" id="kilometraza" value={form.kilometraza} onChange={handleChange} min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="godiste">Godište</Label>
                <Input type="number" name="godiste" id="godiste" value={form.godiste} onChange={handleChange} min={1980} max={new Date().getFullYear()} />
              </div>
            </div>
          </div>

          {/* Održavanje */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Održavanje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sledecaRegistracija">Sledeća registracija</Label>
                <Input type="date" name="sledecaRegistracija" id="sledecaRegistracija" value={form.sledecaRegistracija} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{editData ? "Ažuriraj" : "Sačuvaj"}</Button>
            {editData && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Otkaži</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
