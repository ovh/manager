import {
  useOrderURL,
  getKMSProductSettings,
} from '@ovh-ux/manager-module-order';

export const useGetOkmsOrderLink = () => {
  const orderBaseUrl = useOrderURL('express_review_base');

  const getOrderLink = (region: string) => {
    const okmsOrder = getKMSProductSettings({ region });
    return `${orderBaseUrl}?products=~(${okmsOrder})`;
  };
  return { getOrderLink };
};
