import React from 'react';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';
import useDateFormat from '@/hooks/useDateFormat';

export const ExpirationCell = ({ row: { original: server }}: any) => {
  const { format } = useDateFormat({
    options: {
      hourCycle: 'h23',
      dateStyle: 'short',
    },
  });
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <div>
          {format(new Date(billingInfo?.billing?.expirationDate))}
        </div>
      )}
    </DSBilling>
  );
};

export default ExpirationCell;
