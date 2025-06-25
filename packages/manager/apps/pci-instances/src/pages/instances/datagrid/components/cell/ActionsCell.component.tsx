import { FC } from 'react';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { TAggregatedInstance } from '@/types/instance/entity.type';

export type TActionsCellProps = {
  isLoading: boolean;
  instance: TAggregatedInstance;
};

export const ActionsCell: FC<TActionsCellProps> = ({ isLoading, instance }) => (
  <LoadingCell isLoading={isLoading}>
    <ActionsMenu items={instance.actions} />
  </LoadingCell>
);
