import React from 'react';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

export const RenewCell = ({ row: { original: server }}: any) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DSBilling server={server.name}>
      {(billingInfo) => (
        <div>
          {billingInfo?.billing?.renew?.current?.mode ? (
            t(
              `server_display_renew-${billingInfo?.billing?.renew?.current?.mode}`,
            )
          ) : (
            <>-</>
          )}
        </div>
      )}
    </DSBilling>
  );
};

export default RenewCell;
