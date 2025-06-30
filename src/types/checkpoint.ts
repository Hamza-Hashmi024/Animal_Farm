
export interface Checkpoint {
  id: string;
  animalTag: string;
  day: number;
  name: string;
  scheduledDate: string;
  actualDate?: string;
  weight?: number;
  weightGain?: number;
  daysSinceLastCheck?: number;
  adg?: number;
  vaccine?: {
    name: string;
    batch: string;
    dose: string;
  };
  dewormer?: {
    name: string;
    dose: string;
  };
  medicines?: Array<{
    name: string;
    dose: string;
  }>;
  completed: boolean;
  notes?: string;
}

export interface AnimalWithCheckpoints {
  tag: string;
  srNo: string;
  breed: string;
  coatColor?: string;
  age?: number;
  weight: number;
  arrivalWeight: number;
  arrivalDate: string;
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
  checkpoints: Checkpoint[];
}

export const CHECKPOINT_DAYS = [0, 3, 7, 21, 50, 75];
export const CHECKPOINT_NAMES = {
  0: "Arrival",
  3: "Day 3 Check",
  7: "Day 7 Check", 
  21: "Day 21 Check",
  50: "Day 50 Check",
  75: "Day 75 Check"
};
