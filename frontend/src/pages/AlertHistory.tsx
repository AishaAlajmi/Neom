import { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, MapPin, Clock } from "lucide-react";
import { alerts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const AlertHistory = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedType !== "all" && alert.type !== selectedType) return false;
    if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) return false;
    if (selectedSite !== "all" && alert.site !== selectedSite) return false;
    if (dateRange.from && alert.timestamp < dateRange.from) return false;
    if (dateRange.to && alert.timestamp > dateRange.to) return false;
    return true;
  });

  const severityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning-foreground border-warning/40",
    high: "bg-destructive/20 text-destructive-foreground border-destructive/40",
    critical: "bg-destructive text-destructive-foreground",
  };

  const sites = Array.from(new Set(alerts.map((a) => a.site)));
  const types = Array.from(new Set(alerts.map((a) => a.type)));

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedSeverity("all");
    setSelectedSite("all");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alert History</h1>
          <p className="text-muted-foreground">View and filter safety alerts and incidents</p>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Sites</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site} value={site}>
                      {site}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No alerts found matching the selected filters
                </p>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs", severityColors[alert.severity])}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{alert.type}</span>
                        {alert.resolved ? (
                          <Badge variant="outline" className="text-xs bg-success/10 border-success/30 text-success-foreground">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-destructive/10 border-destructive/30 text-destructive-foreground">
                            Active
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.id}</span>
                    </div>
                    <p className="text-sm text-foreground mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.site}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(alert.timestamp, "MMM dd, yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AlertHistory;
