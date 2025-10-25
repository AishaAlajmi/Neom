import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { sites } from "@/data/mockData";
import { Video, Activity, Users, AlertCircle } from "lucide-react";
import CameraFeed from "@/components/monitoring/CameraFeed";

const LiveMonitoring = () => {
  const [selectedSiteId, setSelectedSiteId] = useState("C4");
  
  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[3];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Live Monitoring</h1>
            <p className="text-muted-foreground">Real-time camera feeds and site status</p>
          </div>
          
          <div className="w-64">
            <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Live AI Camera Detection */}
        <CameraFeed />

        {/* Site Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={
                    selectedSite.status === "active" ? "bg-success" :
                    selectedSite.status === "warning" ? "bg-warning" : "bg-destructive"
                  }>
                    {selectedSite.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Workers</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSite.activeWorkers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Cameras</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedSite.cameras.filter(c => c.status === "online").length}/{selectedSite.cameras.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Violations Today</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSite.violations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camera Feeds */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Camera Feeds - {selectedSite.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSite.cameras.map((camera) => (
                <div key={camera.id} className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                    <img 
                      src={camera.feed}
                      alt={camera.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={
                        camera.status === "online" 
                          ? "bg-success text-success-foreground" 
                          : "bg-destructive text-destructive-foreground"
                      }>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            camera.status === "online" ? "bg-white animate-pulse" : "bg-white"
                          }`} />
                          {camera.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium">{camera.name}</p>
                      <p className="text-white/80 text-xs">{camera.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LiveMonitoring;
