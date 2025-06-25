import { DeepReadonly } from '@/types/utils.type';
import { TListCellItem } from '../datagrid/components/cell/ListCell.component';
import { TAggregatedInstanceAddress } from '@/types/instance/entity.type';

export const mapAddressesToListItems = (
  addresses?: DeepReadonly<TAggregatedInstanceAddress[]>,
): TListCellItem[] => addresses?.map(({ ip }) => ({ id: ip, name: ip })) ?? [];
