import {
  useOrderURL,
  getVcdProductSettings,
} from '@ovh-ux/manager-module-order';

interface IVcdOrder {
  serviceName: string;
  planCode: string;
  quantity?: number;
  vdcOrgId?: string;
}

const useVcdOrder = ({
  serviceName,
  planCode,
  quantity,
  vdcOrgId,
}: IVcdOrder) => {
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
