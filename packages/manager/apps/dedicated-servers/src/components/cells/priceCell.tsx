import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

export const PriceCell = (server: DedicatedServer) => {
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <DataGridTextCell>
          {billingInfo?.billing?.pricing?.price?.text}
        </DataGridTextCell>
      )}
    </DSBilling>
  );
};

export default PriceCell;
