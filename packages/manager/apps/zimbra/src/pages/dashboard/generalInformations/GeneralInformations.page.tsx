import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Divider, ICON_NAME, Icon, ProgressBar } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { GridLayout, Link, Text, Tile } from '@ovh-ux/muk';

import { BadgeStatus, GuideLink } from '@/components';
import { useOrganization, usePlatform } from '@/data/hooks';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import { GO_TO_SERVICES, ORDER_ZIMBRA_EMAIL_ACCOUNT } from '@/tracking.constants';
import { capitalize } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { OngoingTasks } from './OngoingTasks.component';

export const GeneralInformations = () => {
  const { t } = useTranslation([
    'dashboard',
    'common',
    'accounts',
    'services',
    NAMESPACES.STATUS,
    NAMESPACES.DASHBOARD,
  ]);
  const { platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();
  const { accountsStatistics } = useAccountsStatistics();
  const { trackClick } = useOvhTracking();

  const hrefOrderEmailAccount = useGenerateUrl('./email_accounts/order', 'href');
  const hrefManageServices = useGenerateUrl('./services', 'href');

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
        value: platformUrn ? (
          <Text
            data-testid="account-offers"
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.account.get]}
          >
            <div className="flex flex-col gap-6">
              {accountsStatistics?.length > 0 &&
                accountsStatistics.map((stats) => {
                  const used = stats.configuredAccountsCount;
                  const total = stats.configuredAccountsCount + stats.availableAccountsCount;

                  return (
                    <div key={stats.offer} className="flex flex-col gap-2">
                      <Text preset="caption">{capitalize(stats.offer.toLowerCase())}</Text>
                      <ProgressBar max={total} value={used}></ProgressBar>
                      <Text preset="caption">
                        {used}/{total}
                      </Text>
                    </div>
                  );
                })}

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href={hrefOrderEmailAccount}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.button,
                      actionType: 'navigation',
                      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT],
                    });
                  }}
                >
                  {t('accounts:zimbra_account_account_order')}
                  <Icon name={ICON_NAME.arrowRight} aria-hidden="true" />
                </Link>
                <Link
                  href={hrefManageServices}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.button,
                      actionType: 'navigation',
                      actions: [GO_TO_SERVICES],
                    });
                  }}
                >
                  {t('services:zimbra_services_manage')}
                  <Icon name={ICON_NAME.arrowRight} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Text>
        ) : null,
      },
    ];
  }, [platformUrn, accountsStatistics, hrefOrderEmailAccount, t, hrefManageServices, trackClick]);

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
        title={t('zimbra_dashboard_tile_accounts_using_title')}
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
