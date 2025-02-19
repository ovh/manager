import { z } from 'zod';

const flatFeeDetailSchema = z.object({
  id: z.string(),
  size: z.number(),
  totalPrice: z.number(),
  unitPrice: z.number(),
});

const flatFeeSchema = z.object({
  details: z.array(flatFeeDetailSchema),
  totalPrice: z.number(),
});

const overQuotaSchema = z.object({
  ids: z.array(z.string()),
  quantity: z.number(),
  totalPrice: z.number(),
  unitPrice: z.number(),
});

const feesSchema = z.object({
  flatFee: flatFeeSchema,
  overQuota: overQuotaSchema,
  savedAmount: z.number(),
  totalPrice: z.number(),
});

const periodSchema = z.object({
  savingsPlansIds: z.array(z.string()).nullable(),
  begin: z.string(),
  consumptionSize: z.number().optional(),
  coverage: z.string(),
  cumulPlanSize: z.number().optional(),
  end: z.string(),
  resourceIds: z.array(z.string()).nullable(),
  utilization: z.string(),
});

const subscriptionSchema = z.object({
  activation: z.string(),
  end: z.string(),
  id: z.string(),
  size: z.number(),
});

const flavorSchema = z.object({
  fees: feesSchema,
  flavor: z.string(),
  periods: z.array(periodSchema),
  subscriptions: z.array(subscriptionSchema),
});

const savingsPlanConsumptionSchema = z.object({
  flavors: z.array(flavorSchema),
  period: z.object({
    from: z.string(),
    to: z.string(),
  }),
  projectId: z.string(),
  totalSavings: z.number(),
});

export type SavingsPlanConsumption = z.infer<
  typeof savingsPlanConsumptionSchema
>;

export type SavingsPlanFlavorConsumption = z.infer<typeof flavorSchema>;
export type SavingsPlanPeriodConsumption = z.infer<typeof periodSchema>;
export type SavingsPlanPeriod = SavingsPlanConsumption['period'];
