import React from 'react';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from './billingCell';

export const PriceCell = (server: DedicatedServer) => {
  return (
    <DSBilling server={server}>
      {(billingInfo) => <>{billingInfo?.billing?.pricing?.price?.text}</>}
    </DSBilling>
  );
};

export default PriceCell;
