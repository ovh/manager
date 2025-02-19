import { FC } from 'react';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { BaseTextCell } from '@/components/datagrid/cell/TextCell.component';
import { DeepReadonly } from '@/types/utils.type';

export type TListCellItem = DeepReadonly<{
  id: string;
  name: string;
}>;

export type TListCellProps = DeepReadonly<{
  isLoading: boolean;
  items: TListCellItem[];
}>;
export const ListCell: FC<TListCellProps> = ({ isLoading, items }) => (
  <LoadingCell isLoading={isLoading}>
    {items.map((item) => (
      <BaseTextCell key={item.id}>{item.name}</BaseTextCell>
    ))}
  </LoadingCell>
);
