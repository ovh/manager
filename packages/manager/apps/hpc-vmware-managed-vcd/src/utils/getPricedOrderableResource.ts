import {
  IVdcOrderableVHost,
  IVdcOrderableVhostPriced,
} from '@/types/vcd-vdc-orderable-resource.interface';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

export const getVhostUcentsPrice = (product: IVdcOrderableVhostPriced) =>
  product.prices[0]?.priceInUcents;

export const getVhostPriceLabel = (product: IVdcOrderableVhostPriced) =>
  product.prices[0]?.price.text;

export const getPricedOrderableVhostList = ({
  vhostList,
  catalog,
}: {
  vhostList: IVdcOrderableVHost[];
  catalog: TVcdCatalog;
}): IVdcOrderableVhostPriced[] => {
  if (!vhostList || !catalog) {
    return [];
  }
  return vhostList
    .reduce((list: IVdcOrderableVhostPriced[], vhost) => {
      const product = catalog.find((pdct) => pdct.planCode === vhost.profile);
      return product ? [...list, { ...vhost, prices: product.prices }] : list;
    }, [])
    .sort((a, b) => getVhostUcentsPrice(a) - getVhostUcentsPrice(b));
};
