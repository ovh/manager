import React, { useMemo } from 'react';
import { OdsDivider } from '@ovhcloud/ods-components/react';
import { DashboardTile, ManagerText } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { AccountStatistics } from '@/data/api';
import { useOrganization, usePlatform } from '@/data/hooks';
import { Guide, GUIDES_LIST } from '@/guides.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { BadgeStatus, GuideLink } from '@/components';
import { OngoingTasks } from './OngoingTasks.component';

export const GeneralInformations = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();

  const links: Record<string, Guide> = {
    'common:webmail': GUIDES_LIST.webmail,
    zimbra_dashboard_administrator_guide: GUIDES_LIST.administrator_guide,
    zimbra_dashboard_user_guides: GUIDES_LIST.user_guide,
  };

  const accountsStatistics: AccountStatistics[] = useMemo(() => {
    return organisation
      ? organisation?.currentState?.accountsStatistics
      : platform?.currentState?.accountsStatistics;
  }, [organisation, platform]);

  const itemsStatus = useMemo(() => {
    return [
      ...(organisation
        ? [
            {
              id: 'serviceStatus',
              label: t('zimbra_dashboard_tile_status_serviceStatus'),
              value: (
                <BadgeStatus
                  data-testid="org-status"
                  status={organisation?.resourceStatus}
                />
              ),
            },
          ]
        : []),
      {
        id: 'ongoing-task',
        label: t('zimbra_dashboard_tile_status_ongoingTask'),
        value: platformUrn && (
          <ManagerText
            className="w-full flex"
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.task.get]}
          >
            <OngoingTasks />
          </ManagerText>
        ),
      },
    ];
  }, [platformUrn, organisation]);

  const itemsConsumption = useMemo(() => {
    return [
      {
        id: 'account-offer',
        label: t('zimbra_dashboard_tile_serviceConsumption_accountOffer'),
        value: platformUrn ? (
          <ManagerText
            data-testid="account-offers"
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.account.get]}
          >
            {accountsStatistics?.length > 0
              ? accountsStatistics?.map((stats) => (
                  <span key={stats.offer}>{`${
                    stats.configuredAccountsCount
                  } / ${stats.configuredAccountsCount +
                    stats.availableAccountsCount} ${stats.offer}`}</span>
                ))
              : t('common:no_email_account')}
          </ManagerText>
        ) : null,
      },
    ];
  }, [platformUrn, accountsStatistics]);

  const itemsUsefulLinks = useMemo(() => {
    return [
      {
        id: 'useful-links',
        value: Object.entries(links).map(([key, value], index, arr) => {
          const isFirst = index === 0;
          const isLast = index === arr.length - 1;
          return (
            <div key={key} className="block">
              <div className={`mb-4 ${!isFirst ? 'mt-4' : ''}`}>
                <GuideLink label={t(key)} guide={value} />
              </div>
              {!isLast && <OdsDivider />}
            </div>
          );
        }),
      },
    ];
  }, [links]);

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-3">
        <DashboardTile
          data-testid="status"
          title={t('common:status')}
          items={itemsStatus}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="platform-accounts"
          title={t('zimbra_dashboard_tile_serviceConsumption_title')}
          items={itemsConsumption}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="useful-links"
          title={t('common:useful_links')}
          items={itemsUsefulLinks}
        />
      </div>
    </div>
  );
};

export default GeneralInformations;
