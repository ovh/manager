import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';
import useDateFormat from '@/hooks/useDateFormat';

type ExpirationCellProps = {
  server: DedicatedServer;
};

export const ExpirationCell: React.FC<ExpirationCellProps> = ({ server }) => {
  const { format } = useDateFormat({
    options: {
      hourCycle: 'h23',
      dateStyle: 'short',
    },
  });
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <DataGridTextCell>
          {format(new Date(billingInfo?.billing?.expirationDate))}
        </DataGridTextCell>
      )}
    </DSBilling>
  );
};

export default ExpirationCell;
