import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { validatePasswordStrength } from "@/lib/security";

export default function AdminPanel() {
  const { addUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const stored = localStorage.getItem("markovickop_users");
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch {
        setUsers([]);
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!newUserData.username || !newUserData.password || !newUserData.email) {
      setError("Sva polja su obavezna");
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    // Password strength validation
    const validation = validatePasswordStrength(newUserData.password);
    if (!validation.valid) {
      setError(validation.errors.join(", "));
      return;
    }

    // Check if username already exists
    if (users.some((u) => u.username === newUserData.username)) {
      setError("Korisničko ime već postoji");
      return;
    }

    setIsLoading(true);

    try {
      const result = await addUser(newUserData.username, newUserData.password, newUserData.email);
      if (result.success) {
        setSuccess("Korisnik je uspešno dodat!");
        setNewUserData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          role: "user",
        });
        setIsAddDialogOpen(false);
        loadUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Došlo je do greške");
      }
    } catch (err) {
      setError("Došlo je do greške prilikom dodavanja korisnika");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (user: any) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      const updatedUsers = users.filter((u) => u.username !== deletingUser.username);
      localStorage.setItem("markovickop_users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSuccess(`Korisnik ${deletingUser.username} je obrisan`);
      setTimeout(() => setSuccess(""), 3000);
    }
    setIsDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upravljanje korisnicima sistema
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Dodaj korisnika
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Dodaj novog korisnika</DialogTitle>
              <DialogDescription>
                Unesite podatke za novog korisnika sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime *</Label>
                <Input
                  id="username"
                  value={newUserData.username}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, username: e.target.value })
                  }
                  placeholder="npr. marko123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email adresa *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  placeholder="marko@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lozinka *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  placeholder="Min 8 karaktera"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Min 8 karaktera, velika/mala slova, brojevi, specijalni znakovi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdi lozinku *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUserData.confirmPassword}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, confirmPassword: e.target.value })
                  }
                  placeholder="Ponovite lozinku"
                  required
                />
              </div>

              {error && (
                <Alert className="bg-red-900/50 border-red-700">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Otkaži
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Dodajem...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Dodaj
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="bg-green-900/50 border-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Svi korisnici
            <Badge variant="secondary" className="ml-auto">
              {users.length}
            </Badge>
          </CardTitle>
          <CardDescription>Pregled svih registrovanih korisnika</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Korisničko ime</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Lozinka</TableHead>
                  <TableHead className="text-right">Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {user.username}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="font-mono text-xs">
                        {user.password?.length === 64 ? "SHA-256 Hash" : "Plain Text"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdi brisanje</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete korisnika{" "}
              <span className="font-semibold">{deletingUser?.username}</span>? Ova akcija se ne
              može poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
