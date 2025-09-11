import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const getOrderCatalogQueryKey = (ovhSubsidiary: OvhSubsidiary, productName: string) => [
  'get',
  'order',
  'catalog',
  productName,
  ovhSubsidiary,
];
