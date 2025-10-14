import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // Samo korisnik "uros" ima pristup Admin Panelu
  if (user?.username !== "uros") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
