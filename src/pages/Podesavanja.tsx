import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Save, Bell, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Podesavanja() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Podešavanja</h1>
        <p className="text-muted-foreground">Upravljanje sistemom i korisničkim podacima</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Korisnički profil
            </CardTitle>
            <CardDescription>Ažurirajte svoje lične podatke</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="ime">Ime i prezime</Label>
              <Input id="ime" defaultValue="Marko Marković" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email adresa</Label>
              <Input id="email" type="email" defaultValue="markovickop@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" defaultValue="+381 60 123 4567" />
            </div>
            <Button className="bg-primary">
              <Save className="h-4 w-4 mr-2" />
              Sačuvaj izmene
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Obaveštenja
            </CardTitle>
            <CardDescription>Upravljajte notifikacijama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email obaveštenja</Label>
                <p className="text-sm text-muted-foreground">
                  Primajte obaveštenja na email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Upozorenja o servisu</Label>
                <p className="text-sm text-muted-foreground">
                  Obaveštenja o predstojećim servisima vozila
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Finansijski izveštaji</Label>
                <p className="text-sm text-muted-foreground">
                  Nedeljni finansijski izveštaji
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Bezbednost
            </CardTitle>
            <CardDescription>Zaštitite svoj nalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Stara lozinka</Label>
              <Input id="oldPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nova lozinka</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Potvrdi novu lozinku</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="secondary">
              <Shield className="h-4 w-4 mr-2" />
              Promeni lozinku
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Sistemska podešavanja
            </CardTitle>
            <CardDescription>Opšta podešavanja sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tamna tema</Label>
                <p className="text-sm text-muted-foreground">
                  Omogući tamni režim interfejsa
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatsko čuvanje</Label>
                <p className="text-sm text-muted-foreground">
                  Automatski sačuvaj izmene
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
