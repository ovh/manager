import { FC } from 'react';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { TInstance } from '@/types/instance/entity.type';

export type TActionsCellProps = {
  isLoading: boolean;
  instance: TInstance;
};

export const ActionsCell: FC<TActionsCellProps> = ({ isLoading, instance }) => (
  <LoadingCell isLoading={isLoading}>
    <ActionsMenu items={instance.actions} />
  </LoadingCell>
);
