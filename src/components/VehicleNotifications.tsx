import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Bell, Calendar, Wrench } from "lucide-react";
import { useMemo } from "react";

interface VehicleNotification {
  id: string;
  voziloId: number;
  voziloNaziv: string;
  tip: "servis" | "registracija" | "revizijaGoriva" | "osiguranje";
  datum: string;
  daysLeft: number;
  urgency: "critical" | "warning" | "info";
}

interface VehicleNotificationsProps {
  vozila: any[];
}

export function VehicleNotifications({ vozila }: VehicleNotificationsProps) {
  const notifications = useMemo(() => {
    const today = new Date();
    const notifs: VehicleNotification[] = [];

    vozila.forEach((vozilo) => {
      // Provera sledećeg servisa
      if (vozilo.sledecaRevizijaGorivo) {
        const servisDate = new Date(vozilo.sledecaRevizijaGorivo);
        const daysLeft = Math.ceil((servisDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 30 && daysLeft >= 0) {
          notifs.push({
            id: `servis-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "servis",
            datum: vozilo.sledecaRevizijaGorivo,
            daysLeft,
            urgency: daysLeft <= 7 ? "critical" : daysLeft <= 14 ? "warning" : "info",
          });
        } else if (daysLeft < 0) {
          notifs.push({
            id: `servis-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "servis",
            datum: vozilo.sledecaRevizijaGorivo,
            daysLeft,
            urgency: "critical",
          });
        }
      }

      // Provera registracije
      if (vozilo.sledecaRegistracija) {
        const regDate = new Date(vozilo.sledecaRegistracija);
        const daysLeft = Math.ceil((regDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 30 && daysLeft >= 0) {
          notifs.push({
            id: `registracija-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "registracija",
            datum: vozilo.sledecaRegistracija,
            daysLeft,
            urgency: daysLeft <= 7 ? "critical" : daysLeft <= 14 ? "warning" : "info",
          });
        } else if (daysLeft < 0) {
          notifs.push({
            id: `registracija-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "registracija",
            datum: vozilo.sledecaRegistracija,
            daysLeft,
            urgency: "critical",
          });
        }
      }

      // Provera osiguranja
      if (vozilo.datumIstekaOsiguranja) {
        const osigDate = new Date(vozilo.datumIstekaOsiguranja);
        const daysLeft = Math.ceil((osigDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 30 && daysLeft >= 0) {
          notifs.push({
            id: `osiguranje-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "osiguranje",
            datum: vozilo.datumIstekaOsiguranja,
            daysLeft,
            urgency: daysLeft <= 7 ? "critical" : daysLeft <= 14 ? "warning" : "info",
          });
        } else if (daysLeft < 0) {
          notifs.push({
            id: `osiguranje-${vozilo.id}`,
            voziloId: vozilo.id,
            voziloNaziv: vozilo.naziv,
            tip: "osiguranje",
            datum: vozilo.datumIstekaOsiguranja,
            daysLeft,
            urgency: "critical",
          });
        }
      }
    });

    // Sort by urgency and days left
    return notifs.sort((a, b) => {
      if (a.urgency === "critical" && b.urgency !== "critical") return -1;
      if (a.urgency !== "critical" && b.urgency === "critical") return 1;
      return a.daysLeft - b.daysLeft;
    });
  }, [vozila]);

  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (tip: string) => {
    switch (tip) {
      case "servis":
        return <Wrench className="h-4 w-4" />;
      case "registracija":
        return <Calendar className="h-4 w-4" />;
      case "osiguranje":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationText = (notif: VehicleNotification) => {
    const tipText = {
      servis: "servis",
      registracija: "registracija",
      osiguranje: "osiguranje",
    }[notif.tip];

    if (notif.daysLeft < 0) {
      return `${notif.voziloNaziv} - ${tipText} je istekla pre ${Math.abs(notif.daysLeft)} dana!`;
    } else if (notif.daysLeft === 0) {
      return `${notif.voziloNaziv} - ${tipText} ističe danas!`;
    } else if (notif.daysLeft === 1) {
      return `${notif.voziloNaziv} - ${tipText} ističe sutra`;
    } else {
      return `${notif.voziloNaziv} - ${tipText} ističe za ${notif.daysLeft} dana`;
    }
  };

  const getVariant = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  const criticalCount = notifications.filter((n) => n.urgency === "critical").length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={criticalCount > 0 ? "destructive" : "outline"}
          size="sm"
          className="relative gap-2"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Obaveštenja</span>
          <Badge
            variant="secondary"
            className="ml-1 px-1.5 py-0 text-xs"
          >
            {notifications.length}
          </Badge>
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Obaveštenja za vozila
          </DialogTitle>
          <DialogDescription>
            {criticalCount > 0 ? (
              <span className="text-destructive font-medium">
                {criticalCount} hitno upozorenje{criticalCount > 1 ? "nja" : ""} (≤7 dana ili isteklo)
              </span>
            ) : (
              "Pregled svih predstojećih datuma za vozila"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {notifications.map((notif) => (
            <Alert
              key={notif.id}
              variant={getVariant(notif.urgency)}
              className="py-2"
            >
              <div className="flex items-start gap-2">
                {getNotificationIcon(notif.tip)}
                <div className="flex-1">
                  <AlertTitle className="text-sm font-medium mb-1">
                    {getNotificationText(notif)}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    Datum: {new Date(notif.datum).toLocaleDateString("sr-RS")}
                  </AlertDescription>
                </div>
                <Badge
                  variant={
                    notif.urgency === "critical"
                      ? "destructive"
                      : notif.urgency === "warning"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {notif.urgency === "critical"
                    ? "Hitno"
                    : notif.urgency === "warning"
                    ? "Uskoro"
                    : "Info"}
                </Badge>
              </div>
            </Alert>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
