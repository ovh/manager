import React, { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Switch, SwitchItem, TEXT_PRESET } from '@ovhcloud/ods-react';

import { Link, LinkType, Text } from '@ovh-ux/muk';

import { AccountStatistics } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import { useAccountsStatistics, useOverridePage } from '@/hooks';
import { capitalize } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import EmailAccountsDatagrid from './EmailAccountsDatagrid.component';
import SlotsDatagrid from './slots/SlotsDatagrid.component';

const switchStateEnum = {
  ACCOUNTS: 'ACCOUNTS',
  SLOTS: 'SLOTS',
} as const;

export const EmailAccounts = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const { platformUrn } = usePlatform();
  const { accountsStatistics, accountsConfigured, accountsUnconfigured } = useAccountsStatistics();

  const isOverridedPage = useOverridePage();
  const [switchState, setSwitchState] = useState<keyof typeof switchStateEnum>(
    switchStateEnum.ACCOUNTS,
  );

  useEffect(() => {
    // switch automatically to unconfigured accounts
    // if no configured accounts and slots available
    if (accountsConfigured === 0 && accountsUnconfigured > 0) {
      setSwitchState(switchStateEnum.SLOTS);
    } else if (switchState === switchStateEnum.SLOTS && accountsUnconfigured === 0) {
      setSwitchState(switchStateEnum.ACCOUNTS);
    }
  }, [accountsConfigured, accountsUnconfigured]);

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
          <Switch
            key={
              Date.now() /* This component has an issue where rerender can cause it to loose the checked input inside... */
            }
            className="mb-6"
            value={switchState}
            data-testid="switch"
            onValueChange={({ value }: { value: 'ACCOUNTS' | 'SLOTS' }) => setSwitchState(value)}
          >
            <SwitchItem
              data-testid="switch-accounts"
              value={switchStateEnum.ACCOUNTS}
              onClick={() => setSwitchState(switchStateEnum.ACCOUNTS)}
            >
              {t('zimbra_account_configured', { value: accountsConfigured })}
            </SwitchItem>
            <SwitchItem
              data-testid="switch-slots"
              value={switchStateEnum.SLOTS}
              onClick={() => setSwitchState(switchStateEnum.SLOTS)}
            >
              {t('zimbra_account_unconfigured', {
                value: accountsUnconfigured,
              })}
            </SwitchItem>
          </Switch>
          {switchState === switchStateEnum.ACCOUNTS ? <EmailAccountsDatagrid /> : <SlotsDatagrid />}
        </>
      )}
    </div>
  );
};

export default EmailAccounts;
