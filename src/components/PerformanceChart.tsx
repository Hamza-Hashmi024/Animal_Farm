
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PerformanceChart() {
  const data = [
    { month: 'Jan', avgWeight: 320, avgADG: 1.1 },
    { month: 'Feb', avgWeight: 350, avgADG: 1.2 },
    { month: 'Mar', avgWeight: 380, avgADG: 1.0 },
    { month: 'Apr', avgWeight: 410, avgADG: 1.3 },
    { month: 'May', avgWeight: 445, avgADG: 1.4 },
    { month: 'Jun', avgWeight: 475, avgADG: 1.2 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Average weight and daily gain over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="weight" orientation="left" />
              <YAxis yAxisId="adg" orientation="right" />
              <Tooltip 
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                yAxisId="weight"
                type="monotone" 
                dataKey="avgWeight" 
                stroke="#16a34a" 
                strokeWidth={3}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                name="Avg Weight (kg)"
              />
              <Line 
                yAxisId="adg"
                type="monotone" 
                dataKey="avgADG" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                name="Avg Daily Gain (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
