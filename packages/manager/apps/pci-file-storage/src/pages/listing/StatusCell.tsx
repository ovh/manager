import React from 'react';
import { DataGridTextCell } from '@ovhcloud/manager-components';
import ShareStatus from '@/components/ShareStatus/ShareStatus';

const StatusCell = ({ status }: { status: string }) => {
  return (
    <DataGridTextCell>
      <ShareStatus status={status} />
    </DataGridTextCell>
  );
};

export default StatusCell;
