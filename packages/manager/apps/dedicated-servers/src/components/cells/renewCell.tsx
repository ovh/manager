import React from 'react';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from './billingCell';

import { getRenewWording } from '../commonCellsWording';

export const RenewCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DSBilling server={server}>
      {(billingInfo) => <div>{t(getRenewWording(billingInfo))}</div>}
    </DSBilling>
  );
};

export default RenewCell;
