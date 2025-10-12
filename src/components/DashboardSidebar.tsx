import { Home, Truck, TrendingUp, Package, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: Home, label: "Početna", path: "/" },
  { icon: Truck, label: "Vozila", path: "/vozila" },
  { icon: TrendingUp, label: "Finansije", path: "/finansije" },
  { icon: Package, label: "Materijal", path: "/materijal" },
  { icon: Settings, label: "Podešavanja", path: "/podesavanja" },
];

export const DashboardSidebar = ({ isOpen }: SidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-16 bottom-0 border-r bg-card shadow-card transition-smooth"
    >
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
                {isOpen && (
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
