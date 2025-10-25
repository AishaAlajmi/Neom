import { useState } from "react";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";
import Layout from "@/components/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import SiteMap from "@/components/dashboard/SiteMap";
import IncidentChart from "@/components/dashboard/IncidentChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import BackendSystemOverview from "@/components/dashboard/BackendSystemOverview";
import { sites, alerts } from "@/data/mockData";
import { Site } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const totalViolations = sites.reduce((sum, site) => sum + site.violations, 0);
  const criticalAlerts = alerts.filter(
    (a) => !a.resolved && a.severity === "critical"
  ).length;

  const statusColors = {
    active: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    critical: "bg-destructive text-destructive-foreground",
  } as const;

  // ---- Default panel when no site is clicked (uses your 4 real images from /public) ----
  const DEFAULT_SITE: Site = {
    id: "site-c4",
    name: "Site C4",
    status: "active",
    activeWorkers: 203,
    violations: 5,
    cameras: [
      {
        id: "c4-main",
        name: "C4 Main",
        status: "online",
        feed: "/inbox_2163725_0e46d95b350ee8bc9c683595ccf5ecb6_construction-safety.jpg",
      },
      {
        id: "c4-equipment",
        name: "C4 Equipment",
        status: "online",
        feed: "/PPE-detection-for-construction.webp",
      },
      {
        id: "c4-workers",
        name: "C4 Workers",
        status: "online",
        feed: "/images.jpg",
      },
      {
        id: "c4-security",
        name: "C4 Security",
        status: "online",
        feed: "/680a070c3b99253410dd4540_67ed5389d0cfa882e60957b_67a380c04818ec6e4d783319_release_1.webp",
      },
    ],
  };

  const siteToShow = selectedSite ?? DEFAULT_SITE;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Safety Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring across all NEOM construction sites
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="PPE Violations Today"
            value={totalViolations}
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant="warning"
            trend={{ value: 12, direction: "down" }}
          />
          <StatsCard
            title="Critical Alerts"
            value={criticalAlerts}
            subtitle="Unresolved incidents"
            icon={Shield}
            variant={criticalAlerts > 0 ? "danger" : "success"}
          />
          <StatsCard
            title="Safety Compliance Rate"
            value="94.2%"
            subtitle="This month"
            icon={Shield}
            variant="success"
            trend={{ value: 3, direction: "up" }}
          />
          <StatsCard
            title="Average Response Time"
            value="3.2 min"
            subtitle="To safety incidents"
            icon={TrendingDown}
            variant="success"
            trend={{ value: 15, direction: "down" }}
          />
        </div>

        {/* Interactive Map and Camera Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Site Locations
            </h2>
            <SiteMap
              sites={sites}
              selectedSite={selectedSite}
              onSelectSite={setSelectedSite}
            />
          </div>

          {/* Right panel always shows either the selected site OR the default C4 feeds with real images */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {siteToShow.name} - Camera Feeds
            </h2>
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Badge className={statusColors[siteToShow.status]}>
                      {siteToShow.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Workers:{" "}
                      <span className="text-foreground font-semibold">
                        {siteToShow.activeWorkers}
                      </span>
                    </span>
                    <span>
                      Cameras:{" "}
                      <span className="text-foreground font-semibold">
                        {siteToShow.cameras.length}
                      </span>
                    </span>
                    <span>
                      Violations:{" "}
                      <span className="text-foreground font-semibold">
                        {siteToShow.violations}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 2x2 grid of camera cards with images */}
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                  {siteToShow.cameras.map((camera) => (
                    <div key={camera.id} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                        <img
                          src={camera.feed}
                          alt={camera.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">
                          {camera.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            camera.status === "online"
                              ? "bg-success/20 text-success-foreground"
                              : "bg-destructive/20 text-destructive-foreground"
                          }`}
                        >
                          {camera.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentChart />
          <RecentAlerts alerts={alerts} />
        </div>

        {/* AI Backend System Overview */}
        <BackendSystemOverview />
      </div>
    </Layout>
  );
};

export default Dashboard;
