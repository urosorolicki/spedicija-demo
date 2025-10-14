import { Home, Truck, TrendingUp, Package, Settings, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

const baseMenuItems = [
  { icon: Home, label: "Početna", path: "/" },
  { icon: Truck, label: "Vozila", path: "/vozila" },
  { icon: TrendingUp, label: "Finansije", path: "/finansije" },
  { icon: Package, label: "Materijal", path: "/materijal" },
];

const adminMenuItem = { icon: Shield, label: "Admin Panel", path: "/admin" };
const settingsMenuItem = { icon: Settings, label: "Podešavanja", path: "/podesavanja" };

export const DashboardSidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const { user } = useAuth();
  
  // Dodaj Admin Panel samo za korisnika "uros"
  const menuItems = [
    ...baseMenuItems,
    ...(user?.username === "uros" ? [adminMenuItem] : []),
    settingsMenuItem,
  ];
  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 256 : 80,
        x: isMobile && !isOpen ? -256 : 0
      }}
      className={cn(
        "fixed left-0 top-16 bottom-0 border-r bg-card shadow-card transition-smooth",
        "z-50",
        isMobile && "w-64"
      )}
    >
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (isMobile && onClose) {
                onClose();
              }
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(isOpen || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};
