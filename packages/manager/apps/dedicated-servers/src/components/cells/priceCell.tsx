import React from 'react';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

export const PriceCell = ({ row: { original: server }}: any) => {
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <div>
          {billingInfo?.billing?.pricing?.price?.text}
        </div>
      )}
    </DSBilling>
  );
};

export default PriceCell;
