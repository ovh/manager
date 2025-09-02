import { getKMSProductSettings } from '@ovh-ux/manager-module-order';

export const getKMSExpressOrderLink = ({
  orderBaseUrl,
  region,
}: {
  orderBaseUrl: string;
  region: string;
}) => {
  const KMSOrder = getKMSProductSettings({ region });
  return `${orderBaseUrl}?products=~(${KMSOrder})`;
};
