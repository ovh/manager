import { DeepReadonly } from '@/types/utils.type';
import { TListCellItem } from '../datagrid/cell/ListCell.component';
import { TAddress } from '@/types/instance/entity.type';

export const mapAddressesToListItems = (
  addresses?: DeepReadonly<TAddress[]>,
): TListCellItem[] => addresses?.map(({ ip }) => ({ id: ip, name: ip })) ?? [];
