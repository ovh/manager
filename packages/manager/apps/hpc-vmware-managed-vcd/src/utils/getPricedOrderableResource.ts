import {
  IVdcOrderableResource,
  IVdcOrderableResourcePriced,
} from '@/types/vcd-vdc-orderable-resource.interface';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

export const getVdcResourcePrice = (resource: IVdcOrderableResourcePriced) =>
  resource.pricing?.priceInUcents;

export const getVdcResourcePriceLabel = (
  resource: IVdcOrderableResourcePriced,
) => resource.pricing.price.text;

export const getPricedVdcResources = ({
  resources,
  catalog,
}: {
  resources: IVdcOrderableResource[];
  catalog: TVcdCatalog;
}): IVdcOrderableResourcePriced[] => {
  if (!resources || !catalog) {
    return [];
  }
  return resources
    .reduce((list: IVdcOrderableResourcePriced[], resource) => {
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
