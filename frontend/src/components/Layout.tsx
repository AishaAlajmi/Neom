import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Video, History } from "lucide-react";
import logo from "@/assets/SiteGuard-logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/live-monitoring", label: "Live Monitoring", icon: Video },
    { path: "/alert-history", label: "Alert History", icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-gradient-primary border-b border-border shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="SiteGuard"
                className="h-10 w-10 transition-transform group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">SiteGuard</span>
                <span className="text-xs text-white/80">
                  Safety Monitoring System
                </span>
              </div>
            </Link>

            <div className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-white text-primary shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium hidden sm:inline">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
