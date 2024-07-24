import { SavingsPlanService } from '@/types/api.type';

export interface SavingsPlanDatagridWrapper {
  data: SavingsPlanService[];
  refetchSavingsPlans: () => void;
}
