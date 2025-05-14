import { z } from 'zod';

export const currencySchema = z.object({
  currencyCode: z.string(),
  priceInUcents: z.number().nullable(),
  text: z.string(),
  value: z.number(),
});

export const flatFeeDetailSchema = z.object({
  id: z.string(),
  size: z.number(),
  totalPrice: currencySchema,
  unitPrice: currencySchema,
});

export const flatFeeSchema = z.object({
  details: z.array(flatFeeDetailSchema),
  totalPrice: currencySchema,
});

export const overQuotaSchema = z.object({
  ids: z.array(z.string()),
  quantity: z.number(),
  totalPrice: currencySchema,
  unitPrice: currencySchema,
});

export const feesSchema = z.object({
  flatFee: flatFeeSchema,
  overQuota: overQuotaSchema,
  savedAmount: currencySchema,
  totalPrice: currencySchema,
});

export const periodSchema = z.object({
  plansIds: z.array(z.string()).nullable(),
  begin: z.string(),
  consumptionSize: z.number().optional(),
  coverage: z.string(),
  cumulPlanSize: z.number().optional(),
  end: z.string(),
  resourceIds: z.array(z.string()).nullable(),
  utilization: z.string(),
});

export const subscriptionSchema = z.object({
  begin: z.string(),
  end: z.string(),
  id: z.string(),
  size: z.number(),
});

export const flavorSchema = z.object({
  fees: feesSchema,
  flavor: z.string(),
  periods: z.array(periodSchema),
  subscriptions: z.array(subscriptionSchema),
});

export const savingsPlanConsumptionSchema = z.object({
  flavors: z.array(flavorSchema),
  period: z.object({
    from: z.string(),
    to: z.string(),
  }),
  projectId: z.string(),
  totalSavings: currencySchema,
});
