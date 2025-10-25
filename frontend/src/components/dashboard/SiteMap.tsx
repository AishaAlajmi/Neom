import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Users, AlertTriangle } from "lucide-react";
import { Site } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface SiteMapProps {
  sites: Site[];
  selectedSite: Site | null;
  onSelectSite: (site: Site) => void;
}

const SiteMap = ({ sites, selectedSite, onSelectSite }: SiteMapProps) => {
  const sitePositions = {
    C1: { top: "25%", left: "20%" },
    C2: { top: "45%", left: "35%" },
    C3: { top: "65%", left: "25%" },
    C4: { top: "35%", left: "60%" },
    C5: { top: "60%", left: "70%" },
  };

  const statusColors = {
    active: "bg-success border-success",
    warning: "bg-warning border-warning",
    critical: "bg-destructive border-destructive",
  };

  return (
    <Card className="bg-gradient-card border-border h-full">
      <CardContent className="p-6 h-full">
        <div className="relative w-full h-full min-h-[400px] bg-muted/30 rounded-lg border border-border overflow-hidden">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Site Markers */}
          {sites.map((site) => {
            const position = sitePositions[site.id as keyof typeof sitePositions];
            const isSelected = selectedSite?.id === site.id;

            return (
              <button
                key={site.id}
                onClick={() => onSelectSite(site)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all",
                  isSelected && "z-10 scale-110"
                )}
                style={{ top: position.top, left: position.left }}
              >
                <div className="relative group">
                  {/* Marker Pin */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all",
                      statusColors[site.status],
                      isSelected ? "ring-4 ring-primary/50" : "hover:scale-110"
                    )}
                  >
                    <MapPin className="h-6 w-6 text-white" fill="currentColor" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full bg-card border border-border rounded-lg p-3 shadow-xl min-w-[180px] transition-opacity pointer-events-none",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <div className="text-sm font-bold text-foreground mb-2">{site.name}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{site.activeWorkers} Workers</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Camera className="h-3 w-3" />
                        <span>{site.cameras.length} Cameras</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{site.violations} Violations</span>
                      </div>
                    </div>
                    <Badge className={cn("mt-2 text-xs", statusColors[site.status])}>
                      {site.status.toUpperCase()}
                    </Badge>
                    {/* Arrow */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-border"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;
