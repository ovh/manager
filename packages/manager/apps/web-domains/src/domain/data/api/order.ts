import { v6 } from '@ovh-ux/manager-core-api';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { order } from '@/domain/types/orderCatalog';

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
