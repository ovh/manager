import React from 'react';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from './billingCell';

export const PriceCell = (server: DedicatedServer) => {
  return (
    <DSBilling server={server}>
      {(billingInfo) => (
        <div>
          {billingInfo?.billing?.pricing?.price?.text}
        </div>
      )}
    </DSBilling>
  );
};

export default PriceCell;
