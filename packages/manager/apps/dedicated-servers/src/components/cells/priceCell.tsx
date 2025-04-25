import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

type PriceCellProps = {
  server: DedicatedServer;
};

export const PriceCell: React.FC<PriceCellProps> = ({ server }) => {
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
