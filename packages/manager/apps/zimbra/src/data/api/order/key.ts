import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const getOrderCatalogQueryKey = ({
  ovhSubsidiary,
  productName,
}: {
  ovhSubsidiary: OvhSubsidiary;
  productName: string;
}) => [`get/order/catalog/${productName}/${ovhSubsidiary}`];
