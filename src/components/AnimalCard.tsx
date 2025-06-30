
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown, User, Stethoscope, Calendar, DollarSign, Clock, AlertTriangle, Scale } from "lucide-react";
import { ScheduledCheckpoints } from "./ScheduledCheckpoints";
import { WeightUpdateDialog } from "./WeightUpdateDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkpoint } from "@/types/checkpoint";
import { getOverdueCheckpoints, getDueCheckpoints } from "@/utils/checkpointUtils";

interface AnimalCardProps {
  tag: string;
  srNo: string;
  breed: string;
  coatColor?: string;
  age?: number;
  weight: number;
  arrivalWeight?: number;
  adg: number;
  status: string;
  farm: string;
  pen: string;
  investor?: string;
  doctor?: string;
  purchaseDate?: string;
  price?: number;
  ratePerKg?: number;
  mandi?: string;
  purchaser?: string;
  arrivalDate?: string;
  onWeightUpdate?: (tag: string, newWeight: number) => void;
  onCheckpointUpdate?: (animalTag: string, checkpoint: Checkpoint) => void;
  checkpoints?: Checkpoint[];
}

export function AnimalCard({ 
  tag, 
  srNo, 
  breed, 
  coatColor, 
  age, 
  weight, 
  arrivalWeight, 
  adg, 
  status, 
  farm, 
  pen, 
  investor, 
  doctor,
  purchaseDate,
  price,
  ratePerKg,
  mandi,
  purchaser,
  arrivalDate,
  onWeightUpdate,
  onCheckpointUpdate,
  checkpoints = []
}: AnimalCardProps) {
  const [showHealthDialog, setShowHealthDialog] = useState(false);
  const [showWeightDialog, setShowWeightDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'quarantine': return 'bg-red-100 text-red-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isGoodADG = adg >= 1.0;
  const overdueCheckpoints = getOverdueCheckpoints(checkpoints);
  const dueCheckpoints = getDueCheckpoints(checkpoints);
  const hasHealthAlerts = overdueCheckpoints.length > 0 || dueCheckpoints.length > 0;

  const handleCheckpointUpdate = (updatedCheckpoint: Checkpoint) => {
    if (onCheckpointUpdate) {
      onCheckpointUpdate(tag, updatedCheckpoint);
    }
  };

  const handleWeightUpdate = (newWeight: number) => {
    if (onWeightUpdate) {
      onWeightUpdate(tag, newWeight);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <h3 className="font-semibold text-lg">{tag}</h3>
                <p className="text-xs text-gray-500">Sr. No: {srNo}</p>
              </div>
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">{breed}</p>
            {coatColor && <p className="text-xs text-gray-500">{coatColor}</p>}
            {age && <p className="text-xs text-gray-500">{age} months old</p>}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Weight</p>
              <div className="flex items-center space-x-2">
                <p className="text-xl font-bold">{weight} kg</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowWeightDialog(true)}
                  title="Update weight"
                >
                  <Scale className="h-3 w-3" />
                </Button>
              </div>
              {arrivalWeight && (
                <p className="text-xs text-gray-500">From {arrivalWeight} kg</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ADG</p>
              <div className="flex items-center space-x-1">
                <p className="text-xl font-bold">{adg}</p>
                {isGoodADG ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {price && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-500">Purchase Price</p>
                <p className="text-sm font-bold">PKR {price.toLocaleString()}</p>
              </div>
              {ratePerKg && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Rate/kg</p>
                  <p className="text-sm font-bold">PKR {ratePerKg}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{farm}</span> • {pen}
            </p>
            
            {investor && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">Investor: {investor}</span>
              </div>
            )}

            {doctor && (
              <div className="flex items-center text-sm text-gray-600">
                <Stethoscope className="h-4 w-4 mr-2" />
                <span className="font-medium">Doctor: {doctor}</span>
              </div>
            )}

            {purchaseDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Purchased: {new Date(purchaseDate).toLocaleDateString()}</span>
              </div>
            )}

            {mandi && (
              <p className="text-xs text-gray-500">Market: {mandi}</p>
            )}
          </div>

          {hasHealthAlerts && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center text-sm text-red-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {overdueCheckpoints.length > 0 
                    ? `${overdueCheckpoints.length} overdue checkpoint${overdueCheckpoints.length > 1 ? 's' : ''}`
                    : `${dueCheckpoints.length} checkpoint${dueCheckpoints.length > 1 ? 's' : ''} due today`
                  }
                </span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowHealthDialog(true)}
            >
              <Stethoscope className="h-4 w-4 mr-1" />
              Enter Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Check Dialog */}
      <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Monitoring - {tag}</DialogTitle>
          </DialogHeader>
          <ScheduledCheckpoints 
            checkpoints={checkpoints}
            onCheckpointUpdate={handleCheckpointUpdate}
          />
        </DialogContent>
      </Dialog>

      {/* Weight Update Dialog */}
      <WeightUpdateDialog
        open={showWeightDialog}
        onOpenChange={setShowWeightDialog}
        animalTag={tag}
        currentWeight={weight}
        onWeightUpdate={handleWeightUpdate}
      />
    </>
  );
}
