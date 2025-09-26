import { Subsidiary } from '@ovh-ux/manager-config';
import { v6 } from '@ovh-ux/manager-core-api';

import { ZimbraPlanCodes } from '../type';
import { UpgradeServiceOrderParamsType, UpgradeServiceOrderResponse, order } from './type';

// GET

export const getOrderCatalog = async ({
  ovhSubsidiary,
  productName,
}: {
  ovhSubsidiary: Subsidiary;
  productName: string;
}) => {
  const { data } = await v6.get<order.publicOrder.Catalog>(
    `/order/catalog/public/${productName}?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};

export const getZimbraUpgradeOrder = async ({
  planCode,
  serviceName,
}: {
  planCode: string;
  serviceName: string;
}) => {
  if (
    ![ZimbraPlanCodes.ZIMBRA_STARTER, ZimbraPlanCodes.ZIMBRA_PRO].includes(
      planCode as ZimbraPlanCodes,
    )
  ) {
    return undefined;
  }
  const { data } = await v6.get<order.publicOrder.Catalog>(
    `/order/upgrade/zimbra/${serviceName}/${planCode}`,
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
