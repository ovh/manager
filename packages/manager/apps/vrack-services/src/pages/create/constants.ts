import {
  vrackProductSettings,
  getVrackServicesProductSettings,
} from '@ovh-ux/manager-core-order';

export const displayNameInputName = 'displayName';
export const regionInputName = 'region';

export const getExpressOrderLink = ({
  orderBaseUrl,
  displayName,
  region,
  includeVrackOrder = false,
}: {
  orderBaseUrl: string;
  displayName?: string;
  region: string;
  includeVrackOrder?: boolean;
}) => {
  const vrackOrder = includeVrackOrder ? vrackProductSettings : '';
  const vrackServicesOrder = getVrackServicesProductSettings({
    displayName,
    region,
  });
  return `${orderBaseUrl}?products=~(${vrackServicesOrder}${vrackOrder})`;
};
