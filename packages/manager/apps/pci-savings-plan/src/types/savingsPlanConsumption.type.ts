import { z } from 'zod';
import {
  savingsPlanConsumptionSchema,
  flavorSchema,
  periodSchema,
} from './savingsPlanConsumption.schema';

export type SavingsPlanConsumption = z.infer<
  typeof savingsPlanConsumptionSchema
>;
export type SavingsPlanFlavorConsumption = z.infer<typeof flavorSchema>;
export type SavingsPlanPeriodConsumption = z.infer<typeof periodSchema>;
export type SavingsPlanPeriod = SavingsPlanConsumption['period'];
