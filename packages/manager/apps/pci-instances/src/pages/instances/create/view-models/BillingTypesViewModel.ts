import { Deps } from '@/deps/deps';
import { BILLING_TYPE } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

type TSelectBillingData = (
  projectId: string,
  flavorId: string | null,
  distributionImageVersionName: string | null,
) => BILLING_TYPE[];

export const selectBillingTypes: Reader<Deps, TSelectBillingData> = (deps) => {
  return (projectId, flavorId, distributionImageVersionName) => {
    if (!distributionImageVersionName || !flavorId) return [];

    const { instancesCatalogPort } = deps;

    const data = instancesCatalogPort.selectInstancesCatalog(projectId);
    console.log('🚀 ~ selectBillingTypes ~ data:', data);
    if (!data) return [];

    const image = data.entities.images.byId.get(distributionImageVersionName); // a changer apres le merge

    const flavorPriceId = `${flavorId}_${image?.osType}_price`;

    const periodPrices = data.entities.flavorPrices.byId.get(flavorPriceId)
      ?.prices;

    const prices = periodPrices?.filter((t) => t.type !== 'licence') || [];
    return prices.map(({ type }) =>
      type === 'hour' ? BILLING_TYPE.Hourly : BILLING_TYPE.Monthly,
    );
  };
};
