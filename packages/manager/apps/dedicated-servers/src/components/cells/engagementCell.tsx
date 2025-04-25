import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

type EngagementCellProps = {
  server: DedicatedServer;
  t: (name: string) => string;
};

export const EngagementCell: React.FC<EngagementCellProps> = ({
  server,
  t,
}) => {
  return (
    <DSBilling server={server.name}>
      {(billingInfo) =>
        billingInfo?.billing?.engagement ? (
          <OdsBadge
            label={t('server_display_with-engagement')}
            color={ODS_BADGE_COLOR.success}
            className="mt-3"
          />
        ) : (
          <OdsBadge
            label={t('server_display_without-engagement')}
            color={ODS_BADGE_COLOR.warning}
            className="mt-3"
          />
        )
      }
    </DSBilling>
  );
};

export default EngagementCell;
