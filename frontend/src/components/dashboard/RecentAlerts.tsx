import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/types/dashboard";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts = ({ alerts }: RecentAlertsProps) => {
  const severityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning-foreground border-warning/40",
    high: "bg-destructive/20 text-destructive-foreground border-destructive/40",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertCircle className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", severityColors[alert.severity])}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{alert.type}</span>
                </div>
                {!alert.resolved && (
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.site}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAlerts;
