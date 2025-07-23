import { v6 } from '@ovh-ux/manager-core-api';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { UpgradeServiceOrderParamsType, UpgradeServiceOrderResponse, order } from './type';

// GET

export const getOrderCatalog = async ({
  ovhSubsidiary,
  productName,
}: {
  ovhSubsidiary: OvhSubsidiary;
  productName: string;
}) => {
  const { data } = await v6.get<order.publicOrder.Catalog>(
    `/order/catalog/public/${productName}?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};

// POST

export const postUpgradeServiceOrder = async ({
  serviceName,
  planCode,
  autoPay = false,
}: UpgradeServiceOrderParamsType) => {
  const { data } = await v6.post<UpgradeServiceOrderResponse>(
    `/order/upgrade/zimbra/${serviceName}/${planCode}`,
    {
      autoPayWithPreferredPaymentMethod: autoPay,
    },
  );
  return data;
};
