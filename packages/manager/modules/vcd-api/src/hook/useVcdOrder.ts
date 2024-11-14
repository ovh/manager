import {
  useOrderURL,
  getVcdProductSettings,
} from '@ovh-ux/manager-module-order';
import { VCDOrder } from '../types';

const useVcdOrder = ({
  serviceName,
  planCode,
  quantity,
  vdcOrgId,
}: VCDOrder) => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const vcdProductSettings = getVcdProductSettings({
    serviceName,
    planCode,
    quantity,
    vdcOrgId,
  });
  const orderLink = `${orderBaseUrl}?products=~(${vcdProductSettings})`;
  const redirectToOrder = () => {
    window.open(orderLink, '_blank', 'noopener,noreferrer');
  };

  return { orderLink, redirectToOrder };
};

export default useVcdOrder;
