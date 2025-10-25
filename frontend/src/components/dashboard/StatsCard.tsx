import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  variant?: "default" | "success" | "warning" | "danger";
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "bg-gradient-card border-border",
    success: "bg-gradient-card border-success/30",
    warning: "bg-gradient-card border-warning/30",
    danger: "bg-gradient-card border-destructive/30",
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
  };

  return (
    <Card className={cn("transition-all hover:shadow-glow", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={cn(
                  "text-sm font-medium",
                  trend.direction === "down" ? "text-success" : "text-destructive"
                )}>
                  {trend.direction === "down" ? "↓" : "↑"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
