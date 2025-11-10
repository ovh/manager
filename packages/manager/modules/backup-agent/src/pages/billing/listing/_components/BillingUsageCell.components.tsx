import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export type  BillingUsageCellProps = { usage: string }

export const BillingUsageCell = ({ usage }: BillingUsageCellProps) => (
  <DataGridTextCell>{usage}</DataGridTextCell>
);
