import { Subsidiary } from '@ovh-ux/manager-config';

export const getOrderCatalogQueryKey = ({
  ovhSubsidiary,
  productName,
}: {
  ovhSubsidiary: Subsidiary;
  productName: string;
}) => [`get/order/catalog/${productName}/${ovhSubsidiary}`];

export const getZimbraUpgradeOrderQueryKey = ({
  planCode,
  serviceName,
}: {
  planCode: string;
  serviceName: string;
}) => ['get', 'order', 'upgrade', 'zimbra', planCode, serviceName];
