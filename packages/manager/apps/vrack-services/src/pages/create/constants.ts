import { vrackProductSettings } from '@ovh-ux/manager-core-order';
import { Region } from '@/api';

export const displayNameInputName = 'displayName';
export const regionInputName = 'region';

export const getExpressOrderLink = ({
  orderBaseUrl,
  displayName,
  selectedRegion,
  includeVrackOrder = false,
}: {
  orderBaseUrl: string;
  displayName?: string;
  selectedRegion: Region;
  includeVrackOrder?: boolean;
}) => {
  const displayNameParam = displayName
    ? `~(label~'displayName~value~'${displayName})`
    : '';
  const regionParam = `~(label~'region~value~'${selectedRegion})`;
  const vrackServicesOrder = `(~(productId~'vrackServices~planCode~'vrack-services~duration~'P1M~pricingMode~'default~configuration~(${displayNameParam}${regionParam}))`;
  const vrackOrder = includeVrackOrder ? `~${vrackProductSettings}` : '';
  return `${orderBaseUrl}?products=~${vrackServicesOrder}${vrackOrder}`;
};
