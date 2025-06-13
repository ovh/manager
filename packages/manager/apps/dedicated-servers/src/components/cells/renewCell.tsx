import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

export const RenewCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <DataGridTextCell>
          {billingInfo?.billing?.renew?.current?.mode ? (
            t(
              `server_display_renew-${billingInfo?.billing?.renew?.current?.mode}`,
            )
          ) : (
            <>-</>
          )}
        </DataGridTextCell>
      )}
    </DSBilling>
  );
};

export default RenewCell;
