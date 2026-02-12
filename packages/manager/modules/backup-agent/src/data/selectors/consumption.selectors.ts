import { VAULT_PLAN_CODE } from '@/module.constants';
import { ServiceConsumption } from '@/types/Consumption.type';

export const selectConsumptionQuantity = (consumptions: ServiceConsumption[]): number =>
  consumptions.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.quantity ?? 0;

export const selectConsumptionPriceText = (consumptions: ServiceConsumption[]): string =>
  consumptions.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.price.text ?? '-';
