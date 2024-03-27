import { useEffect, useState } from 'react';
import { useCloudCatalog } from './catalog/useCloudCatalog';

type TState = {
  size: string;
  price: {
    month: number;
    hour: number;
  };
};

export const useSelectedGateway = () => {
  const { data, isPending } = useCloudCatalog();
  const [state, setState] = useState<TState>(null);

  useEffect(() => {
    if (data) {
      const gatewayProducts = (data?.addons || [])
        .filter((addon) => addon.product?.startsWith('publiccloud-gateway'))
        .sort(
          (
            { pricings: [{ price: priceA }] },
            { pricings: [{ price: priceB }] },
          ) => Number(priceA) - Number(priceB),
        )
        .filter(
          ({ product }, _index: number, arr: { product: string }[]) =>
            product === arr[0].product,
        );
      const [monthlyPriceObj] =
        (gatewayProducts || [])?.find(({ planCode }) =>
          planCode?.includes('month'),
        )?.pricings || [];
      const [hourlyPriceObj] =
        (gatewayProducts || []).find(({ planCode }) =>
          planCode.includes('hour'),
        )?.pricings || [];

      const size = gatewayProducts[0].product
        .split('-')
        .slice(-1)
        .join();
      const pricePerMonth = monthlyPriceObj.price;
      const pricePerHour = hourlyPriceObj.price;

      setState(() => ({
        size,
        price: { hour: Number(pricePerHour), month: Number(pricePerMonth) },
      }));
    }
  }, [data]);

  return { state, isPending };
};
