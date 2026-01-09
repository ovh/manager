import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Divider } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { GridLayout, Text, Tile } from '@ovh-ux/muk';

import { BadgeStatus, GuideLink } from '@/components';
import { useOrganization, usePlatform } from '@/data/hooks';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import { useAccountsStatistics } from '@/hooks';
import { capitalize } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { OngoingTasks } from './OngoingTasks.component';

export const GeneralInformations = () => {
  const { t } = useTranslation(['dashboard', 'common', NAMESPACES.STATUS, NAMESPACES.DASHBOARD]);
  const { platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();
  const { accountsStatistics } = useAccountsStatistics();

  const links: Record<string, Guide> = {
    'common:webmail': GUIDES_LIST.webmail,
    zimbra_dashboard_administrator_guide: GUIDES_LIST.administrator_guide,
    zimbra_dashboard_user_guides: GUIDES_LIST.user_guide,
    zimbra_dashboard_ovh_mail_migrator: GUIDES_LIST.ovh_mail_migrator,
  };

  const itemsStatus = useMemo(() => {
    return [
      ...(organisation
        ? [
            {
              id: 'serviceStatus',
              label: t('zimbra_dashboard_tile_status_serviceStatus'),
              value: <BadgeStatus data-testid="org-status" status={organisation?.resourceStatus} />,
            },
          ]
        : []),
      {
        id: 'ongoing-task',
        label: t('zimbra_dashboard_tile_status_ongoingTask'),
        value: platformUrn && (
          <Text className="flex w-full" urn={platformUrn} iamActions={[IAM_ACTIONS.task.get]}>
            <OngoingTasks />
          </Text>
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
          <Text
            data-testid="account-offers"
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.account.get]}
          >
            <div className="flex flex-col">
              {accountsStatistics?.length > 0
                ? accountsStatistics?.map((stats) => (
                    <span key={stats.offer}>{`${stats.configuredAccountsCount} / ${
                      stats.configuredAccountsCount + stats.availableAccountsCount
                    } ${capitalize(stats.offer.toLowerCase())}`}</span>
                  ))
                : t('common:no_email_account')}
            </div>
          </Text>
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
              {!isLast && <Divider />}
            </div>
          );
        }),
      },
    ];
  }, [links]);

  return (
    <GridLayout>
      <Tile.Root title={t(`${NAMESPACES.STATUS}:status`)} data-testid="status">
        {itemsStatus.map((item, index) => (
          <Tile.Item.Root key={index}>
            <Tile.Item.Term label={item.label}></Tile.Item.Term>
            <Tile.Item.Description divider={false}>{item.value}</Tile.Item.Description>
          </Tile.Item.Root>
        ))}
      </Tile.Root>
      <Tile.Root
        title={t('zimbra_dashboard_tile_serviceConsumption_title')}
        data-testid="platform-accounts"
      >
        {itemsConsumption.map((item, index) => (
          <Tile.Item.Root key={index}>
            <Tile.Item.Term label={item.label}></Tile.Item.Term>
            <Tile.Item.Description divider={false}>{item.value}</Tile.Item.Description>
          </Tile.Item.Root>
        ))}
      </Tile.Root>
      <Tile.Root title={t('common:useful_links')} data-testid="useful-links">
        {itemsUsefulLinks.map((item, index) => (
          <Tile.Item.Root key={index}>
            <Tile.Item.Description divider={false}>{item.value}</Tile.Item.Description>
          </Tile.Item.Root>
        ))}
      </Tile.Root>
    </GridLayout>
  );
};

export default GeneralInformations;
