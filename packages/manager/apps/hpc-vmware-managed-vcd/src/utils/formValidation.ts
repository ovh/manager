import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from '@/pages/dashboard/datacentre/compute-order/DatacentreComputeOrder.constants';
import {
  STORAGE_ORDER_MAX_QUANTITY,
  STORAGE_ORDER_MIN_QUANTITY,
} from '@/pages/dashboard/datacentre/storage/storage-order/DatacentreStorageOrder.constants';

export const validateOrganizationName = (name: string) =>
  /^.{1,128}$/.test(name);

export const validateDescription = (description: string) =>
  /^.{1,256}$/.test(description);

const validateQuantity = ({
  quantity,
  min,
  max,
}: {
  quantity: number;
  min: number;
  max: number;
}) => quantity >= min && quantity <= max;

export const validateComputeQuantity = (quantity: number) =>
  validateQuantity({
    quantity,
    min: COMPUTE_ORDER_MIN_QUANTITY,
    max: COMPUTE_ORDER_MAX_QUANTITY,
  });

export const validateStorageQuantity = (quantity: number) =>
  validateQuantity({
    quantity,
    min: STORAGE_ORDER_MIN_QUANTITY,
    max: STORAGE_ORDER_MAX_QUANTITY,
  });
