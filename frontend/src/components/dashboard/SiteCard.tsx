import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Camera, AlertTriangle } from "lucide-react";
import { Site } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface SiteCardProps {
  site: Site;
  onViewDetails: (site: Site) => void;
}

const SiteCard = ({ site, onViewDetails }: SiteCardProps) => {
  const statusColors = {
    active: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-glow transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{site.name}</h3>
              <Badge className={cn("mt-1", statusColors[site.status])}>
                {site.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Workers</p>
              <p className="font-semibold text-foreground">{site.activeWorkers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Cameras</p>
              <p className="font-semibold text-foreground">{site.cameras.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Violations</p>
              <p className="font-semibold text-foreground">{site.violations}</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onViewDetails(site)} 
          className="w-full bg-gradient-primary text-white hover:opacity-90"
        >
          View Cameras
        </Button>
      </CardContent>
    </Card>
  );
};

export default SiteCard;
