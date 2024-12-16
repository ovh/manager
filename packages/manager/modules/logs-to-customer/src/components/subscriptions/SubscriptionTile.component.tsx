import React from 'react';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-components/react';
import { ODS_DIVIDER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { LogSubscription } from '../../data/types/dbaas/logs';
import SubscriptionStreamTitle from './SubscriptionStreamTitle.component';
import SubscriptionStreamActions from './SubscriptionStreamActions.component';
import SubscriptionLogService from './SubscriptionLogService.component';

type SubscriptionTileProps = {
  subscription: LogSubscription;
};

const SubscriptionTile = ({ subscription }: SubscriptionTileProps) => {
  const { t } = useTranslation('logSubscription');

  return (
    <OsdsTile rounded inline className="flex flex-col w-full h-fit">
      <div className="flex flex-col gap-6">
        <CommonTitle>{t('log_subscription_tile_title')}</CommonTitle>
        <SubscriptionLogService
          subscription={subscription}
        ></SubscriptionLogService>
        <SubscriptionStreamTitle
          subscription={subscription}
        ></SubscriptionStreamTitle>
        <OsdsDivider separator size={ODS_DIVIDER_SIZE.one} />
        <SubscriptionStreamActions
          subscription={subscription}
        ></SubscriptionStreamActions>
      </div>
    </OsdsTile>
  );
};

export default SubscriptionTile;
