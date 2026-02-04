import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import {
  KNOW_MORE_BASE_URL,
  KNOW_MORE_LIST,
} from '@/components/subscriptions/SubscriptionEmpty.constants';

const KnowMoreLink = () => {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [knowMoreLink, setKnowMoreLink] = useState('');

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guide = KNOW_MORE_LIST[ovhSubsidiary as CountryCode] || KNOW_MORE_LIST.GB;
      const knowMoreUrl = KNOW_MORE_BASE_URL[ovhSubsidiary] ?? KNOW_MORE_BASE_URL.EU;
      setKnowMoreLink(`${knowMoreUrl}${guide}`);
    };
    void getSubSidiary();
  }, [environment]);

  return (
    <Link href={knowMoreLink} target="_blank">
      {t('log_subscription_empty_tile_button_know_more')}
      <Icon name={ICON_NAME.externalLink} />
    </Link>
  );
};

export default KnowMoreLink;
