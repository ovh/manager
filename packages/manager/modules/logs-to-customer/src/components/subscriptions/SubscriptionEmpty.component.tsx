import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { OdsText, OdsButton, OdsCard } from '@ovhcloud/ods-components/react';
import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { CountryCode } from '@ovh-ux/manager-config';
import {
  KNOW_MORE_BASE_URL,
  KNOW_MORE_LIST,
} from './SubscriptionEmpty.constants';
import { LogsActionEnum } from '../../types/logsTracking';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';

const SubscriptionEmpty = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('logSubscription');
  const subscribeLogsAccess = useLogTrackingActions(
    LogsActionEnum.subscribe_logs_access,
  );
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [knowMoreLink, setKnowMoreLink] = useState('');

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guide =
        KNOW_MORE_LIST[ovhSubsidiary as CountryCode] || KNOW_MORE_LIST.GB;
      const knowMoreUrl =
        KNOW_MORE_BASE_URL[ovhSubsidiary] ?? KNOW_MORE_BASE_URL.EU;
      setKnowMoreLink(`${knowMoreUrl}${guide}`);
    };
    getSubSidiary();
  }, []);

  const { trackClick } = useOvhTracking();

  return (
    <OdsCard className="flex flex-col p-6">
      <div className="flex flex-col gap-6">
        <OdsText preset="heading-4">
          {t('log_subscription_empty_tile_title')}
        </OdsText>
        <OdsText preset="paragraph">
          {t('log_subscription_empty_tile_description')}
        </OdsText>
        <Links
          type={LinkType.external}
          label={t('log_subscription_empty_tile_button_know_more')}
          href={knowMoreLink}
          target="_blank"
        />
        <OdsButton
          variant="outline"
          className="[&::part(button)]:w-full"
          size="sm"
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [subscribeLogsAccess],
            });
            navigate('streams');
          }}
          label={t('log_subscription_empty_tile_button_subscribe')}
        />
      </div>
    </OdsCard>
  );
};

export default SubscriptionEmpty;
