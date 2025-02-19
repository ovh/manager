import { TAddress } from '@/data/hooks/instance/useInstances';
import { DeepReadonly } from '@/types/utils.type';
import { TListCellItem } from '../datagrid/cell/ListCell.component';

export const mapAddressesToListItems = (
  addresses?: DeepReadonly<TAddress[]>,
): TListCellItem[] => addresses?.map(({ ip }) => ({ id: ip, name: ip })) ?? [];
