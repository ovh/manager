import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';
import { DSBilling } from './billingCell';
import { getEngagementWording } from '../commonCellsWording';

export const EngagementCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DSBilling server={server}>
      {(billingInfo) => (
        <OdsBadge
          label={t(getEngagementWording(billingInfo))}
          color={
            billingInfo?.billing?.engagement
              ? ODS_BADGE_COLOR.success
              : ODS_BADGE_COLOR.warning
          }
          className="mt-3"
        />
      )}
    </DSBilling>
  );
};

export default EngagementCell;
