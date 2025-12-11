import { Deps } from '@/deps/deps';
import { BillingType } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

type TSelectBillingData = (
  projectId: string,
  flavorId: string | null,
  distributionImageVersionName: string | null,
) => BillingType[];

export const selectBillingTypes: Reader<Deps, TSelectBillingData> = (deps) => {
  return (projectId, flavorId, distributionImageVersionName) => {
    if (!distributionImageVersionName || !flavorId) return [];

    const { instancesCatalogPort } = deps;

    const data = instancesCatalogPort.selectInstancesCatalog(projectId);
    if (!data) return [];

    const image = data.entities.images.byId.get(distributionImageVersionName); // a changer apres le merge

    const flavorPriceId = `${flavorId}_${image?.osType}_price`;

    const periodPrices = data.entities.flavorPrices.byId.get(flavorPriceId)
      ?.prices;

    const prices = periodPrices?.filter((t) => t.type !== 'licence') || [];
    return prices.map(({ type }) =>
      type === 'hour' ? BillingType.Hourly : BillingType.Monthly,
    );
  };
};
