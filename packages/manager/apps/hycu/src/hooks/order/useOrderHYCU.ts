import {
  useOrderURL,
  getHYCUProductSettings,
} from '@ovh-ux/manager-module-order';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { useEffect, useState } from 'react';

interface HYCUOrder {
  planCode: string;
  region: OvhSubsidiary;
}

const useOrderHYCU = ({ planCode, region }: HYCUOrder) => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const [orderLink, setOrderLink] = useState(null);
  useEffect(() => {
    const HYCUProductSettings = getHYCUProductSettings({
      planCode,
      region,
    });
    if (planCode)
      setOrderLink(`${orderBaseUrl}?products=~(${HYCUProductSettings})`);
    else setOrderLink(null);
  }, [planCode, region]);

  const redirectToOrder = () => {
    window.open(orderLink, '_blank', 'noopener,noreferrer');
  };

  return { orderLink, redirectToOrder };
};

export default useOrderHYCU;
