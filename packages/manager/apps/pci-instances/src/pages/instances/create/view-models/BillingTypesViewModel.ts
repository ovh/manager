import { Deps } from '@/deps/deps';
import { BILLING_TYPE } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

type TSelectBillingData = (
  projectId: string,
  flavorId: string | null,
  osType: string | null,
) => BILLING_TYPE[];

export const selectBillingTypes: Reader<Deps, TSelectBillingData> = (deps) => (
  projectId,
  flavorId,
  osType,
) => {
  if (!osType || !flavorId) return [];

  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);
  if (!data) return [];

  const flavorPriceId = `${flavorId}_${osType}_price`;
  const prices = data.entities.flavorPrices.byId.get(flavorPriceId)?.prices;
  const periodPrices =
    prices?.filter(
      (price) => price.type !== 'licence' && price.type !== 'licenceMonth',
    ) || [];

  return periodPrices.map(({ type }) =>
    type === 'hour' ? BILLING_TYPE.Hourly : BILLING_TYPE.Monthly,
  );
};
