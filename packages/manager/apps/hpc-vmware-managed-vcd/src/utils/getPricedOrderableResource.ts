import {
  IVdcOrderableVHost,
  IVdcOrderableVhostPriced,
} from '@/types/vcd-vdc-orderable-resource.interface';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

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
  return vhostList.map((vhost) => {
    const match = catalog.find((product) => product.planCode === vhost.profile);
    return { ...vhost, prices: match?.prices || [] };
  });
};
