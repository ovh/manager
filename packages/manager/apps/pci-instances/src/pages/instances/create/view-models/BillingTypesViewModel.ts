import { Deps } from '@/deps/deps';
import { TPrice } from '@/domain/entities/instancesCatalog';
import { BILLING_TYPE } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

const BILLING_PERIOD_PRICE_TYPES: readonly TPrice['type'][] = ['hour', 'month'];

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
    prices?.filter((price) =>
      BILLING_PERIOD_PRICE_TYPES.includes(price.type),
    ) ?? [];

  return periodPrices.map(({ type }) =>
    type === 'hour' ? BILLING_TYPE.Hourly : BILLING_TYPE.Monthly,
  );
};
