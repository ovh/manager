import React from 'react';
import { OdsDivider } from '@ovhcloud/ods-components/react';
import {
  DashboardTile,
  ManagerText,
  Subtitle,
  TileBlock,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { AccountStatistics } from '@/api/api.type';
import { BadgeStatus } from '@/components/BadgeStatus';
import { useOrganization, usePlatform } from '@/hooks';
// import { OngoingTasks } from './OngoingTasks';
import { Guide, GUIDES_LIST } from '@/guides.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import GuideLink from '@/components/GuideLink';

interface GuideLinks {
  [key: string]: Guide;
}

function GeneralInformation() {
  const { t } = useTranslation('dashboard');
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();

  const guideLinks = (links: GuideLinks) => {
    const entries = Object.entries(links);
    return entries.map(([key, value], index) => {
      const isFirst = index === 0;
      const isLast = index === entries.length - 1;
      return (
        <div key={key} className="block">
          <div className={`mb-4 ${!isFirst ? 'mt-4' : ''}`}>
            <GuideLink label={t(key)} guide={value} />
          </div>
          {!isLast && <OdsDivider />}
        </div>
      );
    });
  };

  const accountsStatistics: AccountStatistics[] = organisation
    ? organisation.currentState.accountsStatistics
    : platform?.currentState?.accountsStatistics;

  const itemsStatus = [
    {
      id: 'ongoing-task',
      label: t(
        'Coming Soon',
      ) /* label={t('zimbra_dashboard_tile_status_ongoingTask')} */,
      value: platformUrn && (
        <ManagerText urn={platformUrn} iamActions={[IAM_ACTIONS.platform.get]}>
          Coming Soon
        </ManagerText>
      ),
    },
  ];

  const itemsConsumption = [
    {
      id: 'account-offer',
      label: t('zimbra_dashboard_tile_serviceConsumption_accountOffer'),
      value: platformUrn ? (
        <ManagerText
          data-testid="platform-accounts"
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
            : t('zimbra_dashboard_tile_serviceConsumption_noAccountOffer')}
        </ManagerText>
      ) : null,
    },
  ];

  const itemsUsefulLinks = [
    {
      id: 'useful-links',
      value: guideLinks({
        zimbra_dashboard_webmail: GUIDES_LIST.webmail,
        zimbra_dashboard_administrator_guide: GUIDES_LIST.administrator_guide,
        zimbra_dashboard_user_guides: GUIDES_LIST.user_guide,
      }),
    },
  ];

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6 mt-8">
      <div className="p-3">
        <DashboardTile
          title={t('zimbra_dashboard_tile_status_title')}
          items={itemsStatus}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          title={t('zimbra_dashboard_tile_serviceConsumption_title')}
          items={itemsConsumption}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          title={t('zimbra_dashboard_tile_usefulLinks_title')}
          items={itemsUsefulLinks}
        />
      </div>
    </div>
  );
}

export default GeneralInformation;
