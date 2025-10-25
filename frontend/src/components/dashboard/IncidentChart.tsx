import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { incidentData } from "@/data/mockData";

const IncidentChart = () => {
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Monthly Safety Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incidentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="incidents" fill="hsl(var(--destructive))" name="Incidents" radius={[8, 8, 0, 0]} />
            <Bar dataKey="violations" fill="hsl(var(--warning))" name="Violations" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncidentChart;
