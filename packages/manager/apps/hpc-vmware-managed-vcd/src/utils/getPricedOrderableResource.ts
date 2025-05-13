import {
  VCDCatalog,
  VCDOrderableResource,
  VCDOrderableResourcePriced,
} from '@ovh-ux/manager-module-vcd-api';

export const getVdcResourcePrice = (resource: VCDOrderableResourcePriced) =>
  resource.pricing?.priceInUcents;

export const getVdcResourcePriceLabel = (
  resource: VCDOrderableResourcePriced,
) => resource.pricing.price.text;

export const getPricedVdcResources = ({
  resources,
  catalog,
}: {
  resources: VCDOrderableResource[];
  catalog: VCDCatalog;
}): VCDOrderableResourcePriced[] => {
  if (!resources || !catalog) {
    return [];
  }
  return resources
    .reduce((list: VCDOrderableResourcePriced[], resource) => {
      const prices = catalog.find(
        ({ planCode }) => planCode === resource.profile,
      )?.prices;
      const pricing = prices?.find(({ capacities }) =>
        capacities.includes('renew'),
      );
      return pricing ? [...list, { ...resource, pricing }] : list;
    }, [])
    .sort((a, b) => getVdcResourcePrice(a) - getVdcResourcePrice(b));
};
