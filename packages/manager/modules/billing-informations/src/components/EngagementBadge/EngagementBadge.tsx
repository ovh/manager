import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import '../../translations';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useBillingInformationsContextServiceDetails } from '../../BillingInformationsTile.context';

export const BillingInformationsEngagement = () => {
  const { t } = useTranslation('billing-informations-tile');
  const {
    data: serviceDetails,
    isLoading,
  } = useBillingInformationsContextServiceDetails();

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_engagement')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isLoading ? (
          <OdsSkeleton className="part-skeleton:max-w-xs" />
        ) : (
          <OdsBadge
            color={ODS_BADGE_COLOR.critical}
            label={
              serviceDetails?.billing.engagement?.endRule?.strategy ??
              t('billing_informations_tile_field_label_engagement_none')
            }
          />
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
