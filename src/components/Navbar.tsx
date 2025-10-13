import { Menu, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-card shadow-card">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="transition-smooth hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">Marković Kop</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">Upravljački sistem</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">markovickop@example.com</p>
          </div>
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs md:text-sm font-semibold text-accent-foreground">MK</span>
          </div>
        </div>
      </div>
    </header>
  );
};
