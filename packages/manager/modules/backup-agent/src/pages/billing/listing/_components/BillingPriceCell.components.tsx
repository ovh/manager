import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export type BillingPriceCellProps = { priceText: string };

export const BillingPriceCell = ({ priceText }: BillingPriceCellProps) => (
  <DataGridTextCell>{priceText}</DataGridTextCell>
);
