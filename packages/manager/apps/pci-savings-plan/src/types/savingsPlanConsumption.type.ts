import { z } from 'zod';

const flatFeeDetailSchema = z.object({
  id: z.string(),
  size: z.number(),
  total_price: z.number(),
  unit_price: z.number(),
});

const flatFeeSchema = z.object({
  details: z.array(flatFeeDetailSchema),
  total_price: z.number(),
});

const overQuotaSchema = z.object({
  ids: z.array(z.string()),
  quantity: z.number(),
  total_price: z.number(),
  unit_price: z.number(),
});

const feesSchema = z.object({
  flat_fee: flatFeeSchema,
  over_quota: overQuotaSchema,
  saved_amount: z.number(),
  total_price: z.number(),
});

const periodSchema = z.object({
  savings_plans_ids: z.array(z.string()).nullable(),
  begin: z.string(),
  consumption_size: z.number().optional(),
  coverage: z.string(),
  cumul_plan_size: z.number().optional(),
  end: z.string(),
  resource_ids: z.array(z.string()).nullable(),
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
  project_id: z.string(),
  total_savings: z.number(),
});

export type SavingsPlanConsumption = z.infer<
  typeof savingsPlanConsumptionSchema
>;

export type SavingsPlanFlavorConsumption = z.infer<typeof flavorSchema>;
export type SavingsPlanPeriodConsumption = z.infer<typeof periodSchema>;
export type SavingsPlanPeriod = SavingsPlanConsumption['period'];
