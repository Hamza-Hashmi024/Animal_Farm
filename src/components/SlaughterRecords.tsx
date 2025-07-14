import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Scale, TrendingUp } from "lucide-react";
import { ViewRecentSlaughterRecords } from "@/Apis/Api";
import React, { useEffect, useState } from "react";

type SlaughterRecord = {
  id: number;
  animalTag: string;
  slaughterDate: string;
  weightBeforeSlaughter: number;
  finalWeightGain: number;
  carcassWeight: number;
  carcassRatio: number;
  carcassQuality: string;
  customerFeedback?: string;
};

export function SlaughterRecords() {
  const [slaughterRecords, setSlaughterRecords] = useState<SlaughterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await ViewRecentSlaughterRecords();
        console.log("Fetched records:", response);

        const recordsRaw = response?.data?.data ?? [];

        const records: SlaughterRecord[] = recordsRaw.map((record: any) => ({
          ...record,
          weightBeforeSlaughter: parseFloat(record.weightBeforeSlaughter),
          finalWeightGain: parseFloat(record.finalWeightGain),
          carcassWeight: parseFloat(record.carcassWeight),
          carcassRatio: parseFloat(record.carcassRatio),
        }));

        setSlaughterRecords(records);
      } catch (err: any) {
        setError(err.message || "Failed to load records.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  const getQualityBadgeVariant = (quality: string) => {
    const lower = quality.toLowerCase();
    if (lower.includes("grade a")) return "default";
    if (lower.includes("grade b")) return "secondary";
    if (lower.includes("grade c")) return "outline";
    return "destructive";
  };

  const bestCarcassRatio = Math.max(...slaughterRecords.map((r) => r.carcassRatio || 0));
  const highestCarcassWeight = Math.max(...slaughterRecords.map((r) => r.carcassWeight || 0));

  const total = slaughterRecords.length;
  const gradeACount = slaughterRecords.filter((r) => r.carcassQuality.toLowerCase().includes("grade a")).length;
  const gradeBCount = slaughterRecords.filter((r) => r.carcassQuality.toLowerCase().includes("grade b")).length;
  const gradeCCount = slaughterRecords.filter((r) => r.carcassQuality.toLowerCase().includes("grade c")).length;

  const getPercentage = (count: number) => (total ? ((count / total) * 100).toFixed(0) : "0");

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Slaughter Records</CardTitle>
          <CardDescription>Latest animals processed with complete data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slaughterRecords.slice(0, 4).map((record) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{record.animalTag}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {record.slaughterDate}
                    </div>
                  </div>
                  <Badge variant={getQualityBadgeVariant(record.carcassQuality)}>
                    {record.carcassQuality.split(" - ")[0]}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Scale className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-gray-600">Carcass:</span>
                    <span className="ml-1 font-medium">{record.carcassWeight}kg</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-gray-600">Ratio:</span>
                    <span className="ml-1 font-medium">{record.carcassRatio}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Gain:</span>
                    <span className="ml-1 font-medium">{record.finalWeightGain}kg</span>
                  </div>
                </div>
                
                {record.customerFeedback && (
                  <div className="text-sm text-gray-600 italic">
                    "{record.customerFeedback}"
                  </div>
                )}
                
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  View Full Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key metrics from recent processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">63.3%</div>
                <div className="text-sm text-gray-600">Best Carcass Ratio</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">298kg</div>
                <div className="text-sm text-gray-600">Highest Carcass Weight</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quality Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade A - Premium</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <span className="text-sm font-medium">50%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade B - Standard</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade C - Commercial</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Customer Satisfaction</h4>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">95%</div>
                <div className="text-sm text-gray-600">Positive Feedback Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
