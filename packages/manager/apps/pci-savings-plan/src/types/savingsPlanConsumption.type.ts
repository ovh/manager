import { z } from 'zod';

const moneySchema = z.object({
  currencyCode: z.string(),
  priceInUcents: z.number().nullable(),
  text: z.string(),
  value: z.number(),
});

const flatFeeDetailSchema = z.object({
  id: z.string(),
  size: z.number(),
  totalPrice: moneySchema,
  unitPrice: moneySchema,
});

const flatFeeSchema = z.object({
  details: z.array(flatFeeDetailSchema),
  totalPrice: moneySchema,
});

const overQuotaSchema = z.object({
  ids: z.array(z.string()),
  quantity: z.number(),
  totalPrice: moneySchema,
  unitPrice: moneySchema,
});

const feesSchema = z.object({
  flatFee: flatFeeSchema,
  overQuota: overQuotaSchema,
  savedAmount: moneySchema,
  totalPrice: moneySchema,
});

const periodSchema = z.object({
  plansIds: z.array(z.string()).nullable(),
  begin: z.string(),
  consumptionSize: z.number().optional(),
  coverage: z.string(),
  cumulPlanSize: z.number().optional(),
  end: z.string(),
  resourceIds: z.array(z.string()).nullable(),
  utilization: z.string(),
});

const subscriptionSchema = z.object({
  begin: z.string(),
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
  totalSavings: moneySchema,
});

export type SavingsPlanConsumption = z.infer<
  typeof savingsPlanConsumptionSchema
>;
export type SavingsPlanFlavorConsumption = z.infer<typeof flavorSchema>;
export type SavingsPlanPeriodConsumption = z.infer<typeof periodSchema>;
export type SavingsPlanPeriod = SavingsPlanConsumption['period'];
