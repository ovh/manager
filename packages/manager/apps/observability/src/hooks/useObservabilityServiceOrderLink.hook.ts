import JSURL from 'jsurl';

import { useOrderURL } from '@ovh-ux/manager-module-order';

const observabilityServiceSettings = JSURL.stringify({
  planCode: 'logs-account',
  productId: 'logs',
  region: 'gra',
});

export const useObservabilityServiceOrderLink = () => {
  const orderBaseUrl = useOrderURL('express_review_base');
  return `${orderBaseUrl}?products=~(${observabilityServiceSettings})`;
};
