import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from './billingCell';
import useDateFormat from '@/hooks/useDateFormat';

export const ExpirationCell = (server: DedicatedServer) => {
  const { format } = useDateFormat({
    options: {
      hourCycle: 'h23',
      dateStyle: 'short',
    },
  });
  return (
    <DSBilling server={server}>
      {(billingInfo) => {
        const expirationDate = billingInfo?.billing?.engagement
          ? billingInfo?.billing?.engagement.endDate
          : billingInfo?.billing?.renew?.current?.nextDate ||
            billingInfo?.billing?.expirationDate;
        return (
          <DataGridTextCell>
            {expirationDate ? format(new Date(expirationDate)) : ''}
          </DataGridTextCell>
        );
      }}
    </DSBilling>
  );
};

export default ExpirationCell;
