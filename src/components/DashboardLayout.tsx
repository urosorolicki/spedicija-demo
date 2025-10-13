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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={handleSidebarToggle} />
      <div className="flex pt-16">
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          isMobile={isMobile} 
          onClose={handleSidebarClose}
        />
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleSidebarClose}
          />
        )}
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-20"
          } p-3 sm:p-4 md:p-6`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
