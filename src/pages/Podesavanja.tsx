import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Save, Bell, Shield, User, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Podesavanja() {
  const { user, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileData, setProfileData] = useState({
    ime: user?.username || "",
    email: user?.email || "",
    telefon: "+381 60 123 4567"
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setIsSavingProfile(true);

    try {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem("markovickop_users") || "[]");
      const updatedUsers = users.map((u: any) => {
        if (u.username === user?.username) {
          return {
            ...u,
            email: profileData.email,
            phone: profileData.telefon,
          };
        }
        return u;
      });
      
      localStorage.setItem("markovickop_users", JSON.stringify(updatedUsers));
      
      // Update current user in localStorage
      const currentUser = updatedUsers.find((u: any) => u.username === user?.username);
      if (currentUser) {
        localStorage.setItem("markovickop_current_user", JSON.stringify(currentUser));
      }
      
      setProfileSuccess("Profil je uspešno ažuriran!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (error) {
      setProfileError("Došlo je do greške prilikom čuvanja profila");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Nova lozinka i potvrda lozinke se ne poklapaju");
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
      if (result.success) {
        setPasswordSuccess("Lozinka je uspešno promenjena!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordError(result.error || "Došlo je do greške prilikom promene lozinke");
      }
    } catch (error) {
      setPasswordError("Došlo je do greške prilikom promene lozinke");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Podešavanja</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Upravljanje sistemom i korisničkim podacima</p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Korisnički profil
            </CardTitle>
            <CardDescription className="text-sm">Ažurirajte svoje lične podatke</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="ime" className="text-sm">Korisničko ime</Label>
              <Input 
                id="ime" 
                value={profileData.ime}
                onChange={(e) => setProfileData({...profileData, ime: e.target.value})}
                className="text-sm" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm">Email adresa</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="text-sm" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefon" className="text-sm">Telefon</Label>
              <Input 
                id="telefon" 
                value={profileData.telefon}
                onChange={(e) => setProfileData({...profileData, telefon: e.target.value})}
                className="text-sm" 
              />
            </div>
            {profileError && (
              <Alert className="bg-red-900/50 border-red-700">
                <AlertDescription className="text-red-200">
                  {profileError}
                </AlertDescription>
              </Alert>
            )}
            {profileSuccess && (
              <Alert className="bg-green-900/50 border-green-700">
                <AlertDescription className="text-green-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {profileSuccess}
                </AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={handleProfileSave}
              className="bg-primary w-full sm:w-auto"
              disabled={isSavingProfile}
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Čuvam...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj izmene
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Obaveštenja
            </CardTitle>
            <CardDescription className="text-sm">Upravljajte notifikacijama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Email obaveštenja</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Primajte obaveštenja na email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Upozorenja o servisu</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Obaveštenja o predstojećim servisima vozila
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Finansijski izveštaji</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Nedeljni finansijski izveštaji
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Bezbednost
            </CardTitle>
            <CardDescription className="text-sm">Zaštitite svoj nalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <form onSubmit={handlePasswordChange}>
              <div className="grid gap-2">
                <Label htmlFor="oldPassword" className="text-sm">Stara lozinka</Label>
                <Input 
                  id="oldPassword" 
                  type="password" 
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="text-sm" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-sm">Nova lozinka</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="text-sm" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-sm">Potvrdi novu lozinku</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="text-sm" 
                  required
                />
              </div>
              
              {passwordError && (
                <Alert className="bg-red-900/50 border-red-700">
                  <AlertDescription className="text-red-200">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert className="bg-green-900/50 border-green-700">
                  <AlertDescription className="text-green-200">
                    {passwordSuccess}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full sm:w-auto"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menjam lozinku...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Promeni lozinku
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Sistemska podešavanja
            </CardTitle>
            <CardDescription className="text-sm">Opšta podešavanja sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Tamna tema</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Omogući tamni režim interfejsa
                </p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Automatsko čuvanje</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Automatski sačuvaj izmene
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              Status bezbednosti
            </CardTitle>
            <CardDescription className="text-sm">Pregled sigurnosnih funkcija</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">SHA-256 Hash lozinke</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                Aktivno
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">XSS zaštita (DOMPurify)</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                Aktivno
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Rate limiting (5 pokušaja/15 min)</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                Aktivno
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Jaka lozinka (8+ karaktera, velika/mala slova, broj, specijalan karakter)</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                Aktivno
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Input sanitizacija</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                Aktivno
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
