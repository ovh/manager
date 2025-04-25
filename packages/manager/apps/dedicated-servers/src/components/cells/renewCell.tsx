import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

type RenewCellProps = {
  server: DedicatedServer;
  t: (name: string) => string;
};

export const RenewCell: React.FC<RenewCellProps> = ({ server, t }) => {
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
