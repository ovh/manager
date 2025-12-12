import { OvhSubsidiary } from '@ovh-ux/muk';

export const getOrderCatalogQueryKey = (ovhSubsidiary: OvhSubsidiary, productName: string) => [
  'get',
  'order',
  'catalog',
  productName,
  ovhSubsidiary,
];
