
import { Checkpoint, CHECKPOINT_DAYS, CHECKPOINT_NAMES } from "@/types/checkpoint";

export function generateCheckpointSchedule(animalTag: string, arrivalDate: string): Checkpoint[] {
  const arrival = new Date(arrivalDate);
  
  return CHECKPOINT_DAYS.map(day => {
    const scheduledDate = new Date(arrival);
    scheduledDate.setDate(arrival.getDate() + day);
    
    return {
      id: `${animalTag}-day-${day}`,
      animalTag,
      day,
      name: CHECKPOINT_NAMES[day as keyof typeof CHECKPOINT_NAMES],
      scheduledDate: scheduledDate.toISOString().split('T')[0],
      completed: false
    };
  });
}

export function getOverdueCheckpoints(checkpoints: Checkpoint[]): Checkpoint[] {
  const today = new Date().toISOString().split('T')[0];
  return checkpoints.filter(cp => !cp.completed && cp.scheduledDate < today);
}

export function getDueCheckpoints(checkpoints: Checkpoint[]): Checkpoint[] {
  const today = new Date().toISOString().split('T')[0];
  return checkpoints.filter(cp => !cp.completed && cp.scheduledDate === today);
}

export function getUpcomingCheckpoints(checkpoints: Checkpoint[], days: number = 7): Checkpoint[] {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  const todayStr = today.toISOString().split('T')[0];
  const futureDateStr = futureDate.toISOString().split('T')[0];
  
  return checkpoints.filter(cp => 
    !cp.completed && 
    cp.scheduledDate > todayStr && 
    cp.scheduledDate <= futureDateStr
  );
}

export function calculateAdg(currentWeight: number, previousWeight: number, days: number): number {
  if (days <= 0) return 0;
  return (currentWeight - previousWeight) / days;
}
