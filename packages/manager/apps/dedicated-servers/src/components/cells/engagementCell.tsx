import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from '../billingCell';

export const EngagementCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
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
