import {
  IVdcOrderableVHost,
  IVdcOrderableVhostPriced,
} from '@/types/vcd-vdc-orderable-resource.interface';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

export const getVhostUcentsPrice = (product: IVdcOrderableVhostPriced) =>
  product.prices[0]?.priceInUcents;

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
    .map((vhost) => {
      const product = catalog.find((pdct) => pdct.planCode === vhost.profile);
      return { ...vhost, prices: product?.prices || [] };
    })
    .sort((a, b) => getVhostUcentsPrice(a) - getVhostUcentsPrice(b));
};
