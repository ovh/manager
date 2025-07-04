import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  KNOW_MORE_BASE_URL,
  KNOW_MORE_LIST,
} from '../subscriptions/SubscriptionEmpty.constants';

const KnowMoreLink = () => {
  const { t } = useTranslation('logSubscription');
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

  return (
    <Links
      type={LinkType.external}
      label={t('log_subscription_empty_tile_button_know_more')}
      href={knowMoreLink}
      target="_blank"
    />
  );
};

export default KnowMoreLink;
