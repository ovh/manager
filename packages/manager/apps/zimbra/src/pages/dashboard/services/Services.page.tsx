import React, { useMemo } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@ovhcloud/ods-react';

import { Text } from '@ovh-ux/muk';

import { AccountStatistics, ZimbraOffer } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useAccountsStatistics, useOverridePage } from '@/hooks';
import { capitalize } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ServicesDatagrid from './ServicesDatagrid.component';

export const Services = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const isOverridedPage = useOverridePage();
  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();
  const enrichedAccountsStatistics: AccountStatistics[] = useMemo(() => {
    return [
      ...(accountsStatistics ?? []),
      {
        offer: ZimbraOffer.BUSINESS,
        availableAccountsCount: 0,
        configuredAccountsCount: 0,
      },
    ];
  }, [accountsStatistics]);

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <>
          <div className="mb-7 flex w-full gap-8">
            {enrichedAccountsStatistics.map((stats: AccountStatistics) => {
              const used = stats.configuredAccountsCount;
              const total = stats.configuredAccountsCount + stats.availableAccountsCount;
              const isBusiness = stats.offer === ZimbraOffer.BUSINESS;

              return (
                <div
                  key={stats.offer}
                  className={`flex-1 flex-col gap-4 rounded-md border border-solid border-gray-400 p-6  ${
                    isBusiness ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Text
                      preset="caption"
                      className={isBusiness ? 'text-gray-400' : ''}
                      urn={platformUrn}
                      iamActions={[IAM_ACTIONS.account.get]}
                    >
                      {capitalize(stats.offer.toLowerCase())}
                    </Text>

                    {isBusiness && (
                      <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-500">
                        {t('zimbra_account_plan_tag_coming_soon')}
                      </span>
                    )}
                  </div>
                  <ProgressBar max={total} value={used} />
                  <Text
                    preset="caption"
                    className={`whitespace-nowrap ${isBusiness ? 'text-gray-400' : ''}`}
                    iamActions={[IAM_ACTIONS.account.get]}
                  >
                    {`${used} / ${total}`}
                  </Text>
                </div>
              );
            })}
          </div>
          <ServicesDatagrid />
        </>
      )}
    </div>
  );
};

export default Services;
