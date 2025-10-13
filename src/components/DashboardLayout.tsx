import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <DashboardSidebar isOpen={sidebarOpen} isMobile={isMobile} />
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-20"
          } p-4 md:p-6`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
