import { useMemo } from 'react';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import { useCloudCatalog } from './catalog/useCloudCatalog';
import { useAvailableHourlyPlansRegion } from './useRegions';

const getGatewayWithLowestPrice = (catalog: TCatalog, plans: string[]) => {
  const gatewayProducts = (catalog.addons || [])
    .filter((addon) => plans.includes(addon.planCode))
    .sort(
      ({ pricings: [{ price: priceA }] }, { pricings: [{ price: priceB }] }) =>
        Number(priceA) - Number(priceB),
    )
    .filter(
      ({ product }, _index: number, arr: { product: string }[]) =>
        product === arr[0].product,
    );
  const [monthlyPriceObj] =
    (gatewayProducts || [])?.find(({ planCode }) => planCode?.includes('month'))
      ?.pricings || [];
  const [hourlyPriceObj] =
    (gatewayProducts || []).find(({ planCode }) => planCode.includes('hour'))
      ?.pricings || [];

  const size = gatewayProducts[0]?.product
    .split('-')
    .slice(-1)
    .join();
  const pricePerMonth = monthlyPriceObj?.price;
  const pricePerHour = hourlyPriceObj?.price;

  return {
    size,
    price: { hour: Number(pricePerHour), month: Number(pricePerMonth) },
  };
};

// TODO: similar use case in network and compute, think to move it to pci-common
export const useDefaultAvailableGateway = (region: string) => {
  const { data } = useCloudCatalog();

  const plans = useAvailableHourlyPlansRegion(region);

  return useMemo(() => (data ? getGatewayWithLowestPrice(data, plans) : null), [
    data,
    plans,
  ]);
};
