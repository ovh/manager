import React from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET } from '@ovhcloud/ods-react';

import { Link, LinkType, Text } from '@ovh-ux/muk';

import { AccountStatistics } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import { useAccountsStatistics, useOverridePage } from '@/hooks';
import { capitalize } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import EmailAccountsDatagrid from './EmailAccountsDatagrid.component';

export const EmailAccounts = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();

  const isOverridedPage = useOverridePage();

  const webmailUrl = GUIDES_LIST.webmail.url.DEFAULT;

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <>
          <div className="mb-6 flex gap-8">
            <div className="flex">
              <Text preset={TEXT_PRESET.heading6} className="mr-4">
                {t('common:webmail')}
                {' :'}
              </Text>
              <Link href={webmailUrl} type={LinkType.external} target="_blank">
                {webmailUrl}
              </Link>
            </div>
            <div className="flex gap-8" data-testid="account-offers">
              <div className="flex gap-8">
                {accountsStatistics?.length > 0
                  ? accountsStatistics?.map((stats: AccountStatistics) => (
                      <div key={stats.offer} className="flex">
                        <Text
                          preset={TEXT_PRESET.heading6}
                          className="mr-4"
                          urn={platformUrn}
                          iamActions={[IAM_ACTIONS.account.get]}
                        >
                          {`Zimbra ${capitalize(stats.offer.toLowerCase())} :`}
                        </Text>
                        <Text urn={platformUrn} iamActions={[IAM_ACTIONS.account.get]}>
                          {`${stats.configuredAccountsCount} / ${
                            stats.configuredAccountsCount + stats.availableAccountsCount
                          }`}
                        </Text>
                      </div>
                    ))
                  : t('common:no_email_account_available')}
              </div>
            </div>
          </div>
          <EmailAccountsDatagrid />
        </>
      )}
    </div>
  );
};

export default EmailAccounts;
