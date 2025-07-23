import React, { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_LINK_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSwitch, OdsSwitchItem, OdsText } from '@ovhcloud/ods-components/react';

import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  ManagerText,
} from '@ovh-ux/manager-react-components';

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
          <div className="flex gap-8 mb-6">
            <div>
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="mr-4">
                {t('common:webmail')}
                {' :'}
              </OdsText>
              <Links
                iconAlignment={IconLinkAlignmentType.right}
                color={ODS_LINK_COLOR.primary}
                href={webmailUrl}
                type={LinkType.external}
                label={webmailUrl}
                target="_blank"
              />
            </div>
            <ManagerText
              className="flex gap-8"
              data-testid="account-offers"
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.account.get]}
            >
              <div className="flex gap-8">
                {accountsStatistics?.length > 0
                  ? accountsStatistics?.map((stats: AccountStatistics) => (
                      <span key={stats.offer}>
                        <OdsText preset={ODS_TEXT_PRESET.heading6} className="mr-4">
                          {`Zimbra ${capitalize(stats.offer.toLowerCase())} :`}
                        </OdsText>
                        <span>{`${stats.configuredAccountsCount} / ${
                          stats.configuredAccountsCount + stats.availableAccountsCount
                        }`}</span>
                      </span>
                    ))
                  : t('common:no_email_account_available')}
              </div>
            </ManagerText>
          </div>
          <OdsSwitch
            key={
              Date.now() /* This component has an issue where rerender can cause it to loose the checked input inside... */
            }
            className="mb-6"
            name="switchState"
            data-testid="switch"
          >
            <OdsSwitchItem
              data-testid="switch-accounts"
              isChecked={switchState === switchStateEnum.ACCOUNTS}
              value={switchStateEnum.ACCOUNTS}
              onClick={() => setSwitchState(switchStateEnum.ACCOUNTS)}
            >
              {t('zimbra_account_configured', { value: accountsConfigured })}
            </OdsSwitchItem>
            <OdsSwitchItem
              data-testid="switch-slots"
              isChecked={switchState === switchStateEnum.SLOTS}
              value={switchStateEnum.SLOTS}
              onClick={() => setSwitchState(switchStateEnum.SLOTS)}
            >
              {t('zimbra_account_unconfigured', {
                value: accountsUnconfigured,
              })}
            </OdsSwitchItem>
          </OdsSwitch>
          {switchState === switchStateEnum.ACCOUNTS ? <EmailAccountsDatagrid /> : <SlotsDatagrid />}
        </>
      )}
    </div>
  );
};

export default EmailAccounts;
