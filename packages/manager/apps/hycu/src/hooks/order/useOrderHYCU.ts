import {
  useOrderURL,
  getHYCUProductSettings,
} from '@ovh-ux/manager-module-order';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';

interface HYCUOrder {
  planCode: string;
  region: OvhSubsidiary;
  serviceName?: string;
}

const useOrderHYCU = ({ planCode, region, serviceName = '' }: HYCUOrder) => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const orderLink = useMemo(() => {
    const HYCUProductSettings = getHYCUProductSettings({
      planCode,
      region,
      serviceName,
    });
    if (planCode) return `${orderBaseUrl}?products=~(${HYCUProductSettings})`;
    return null;
  }, [planCode, region]);

  const redirectToOrder = () => {
    window.open(orderLink, '_blank', 'noopener,noreferrer');
  };

  return { orderLink, redirectToOrder };
};

export default useOrderHYCU;
