import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from '@/pages/dashboard/datacentre/compute-order/DatacentreComputeOrder.constants';

export const validateOrganizationName = (name: string) =>
  /^.{1,128}$/.test(name);

export const validateDescription = (description: string) =>
  /^.{1,256}$/.test(description);

export const validateComputeQuantity = (quantity: number) =>
  quantity >= COMPUTE_ORDER_MIN_QUANTITY &&
  quantity <= COMPUTE_ORDER_MAX_QUANTITY;
