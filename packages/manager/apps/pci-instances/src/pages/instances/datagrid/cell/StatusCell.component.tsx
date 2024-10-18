import { FC } from 'react';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { TInstance } from '@/data/hooks/instance/useInstances';

type TStatusCellProps = {
  instance: TInstance;
  isLoading: boolean;
};

export const StatusCell: FC<TStatusCellProps> = ({ isLoading, instance }) => (
  <LoadingCell isLoading={isLoading}>
    <StatusChip status={instance.status} />
  </LoadingCell>
);
