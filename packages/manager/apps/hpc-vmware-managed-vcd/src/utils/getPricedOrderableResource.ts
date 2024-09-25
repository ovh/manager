import {
  IVdcOrderableResource,
  IVdcOrderableResourcePriced,
} from '@/types/vcd-vdc-orderable-resource.interface';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

export const getVdcResourcePrice = (product: IVdcOrderableResourcePriced) =>
  product.prices[0]?.priceInUcents;

export const getVdcResourcePriceLabel = (
  product: IVdcOrderableResourcePriced,
) => product.prices[0]?.price.text;

export const getPricedVdcResourceList = ({
  resourceList,
  catalog,
}: {
  resourceList: IVdcOrderableResource[];
  catalog: TVcdCatalog;
}): IVdcOrderableResourcePriced[] => {
  if (!resourceList || !catalog) {
    return [];
  }
  return resourceList
    .reduce((list: IVdcOrderableResourcePriced[], resource) => {
      const product = catalog.find((pdt) => pdt.planCode === resource.profile);
      return product
        ? [...list, { ...resource, prices: product.prices }]
        : list;
    }, [])
    .sort((a, b) => getVdcResourcePrice(a) - getVdcResourcePrice(b));
};
