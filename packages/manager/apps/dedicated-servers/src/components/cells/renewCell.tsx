import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

import { getRenewWording } from '../commonCellsWording';

export const RenewCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <DataGridTextCell>{t(getRenewWording(billingInfo))}</DataGridTextCell>
      )}
    </DSBilling>
  );
};

export default RenewCell;
