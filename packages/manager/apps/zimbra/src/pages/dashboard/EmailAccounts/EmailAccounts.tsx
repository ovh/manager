import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  Links,
  LinkType,
  ManagerButton,
  ManagerText,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import { AccountType } from '@/api/account';
import {
  useOverridePage,
  useGenerateUrl,
  useAccountList,
  usePlatform,
  useOrganization,
  useDomains,
} from '@/hooks';
import LabelChip from '@/components/LabelChip';
import guidesConstants from '@/guides.constants';
import ActionButtonEmail from './ActionButtonEmail';
import {
  convertOctets,
  DATAGRID_REFRESH_INTERVAL,
  DATAGRID_REFRESH_ON_MOUNT,
} from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import Loading from '@/components/Loading/Loading';
import { BadgeStatus } from '@/components/BadgeStatus';
import { ResourceStatus, AccountStatistics } from '@/api/api.type';

export type EmailsItem = {
  id: string;
  email: string;
  offer: string;
  organizationId: string;
  organizationLabel: string;
  used: number;
  available: number;
  status: ResourceStatus;
};

const columns: DatagridColumn<EmailsItem>[] = [
  {
    id: 'email account',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.email}
      </OsdsText>
    ),
    label: 'zimbra_account_datagrid_email_label',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'zimbra_account_datagrid_organization_label',
  },
  {
    id: 'offer',
    cell: (item) =>
      item.offer && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.offer}
        </OsdsText>
      ),
    label: 'zimbra_account_datagrid_offer_label',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'zimbra_account_datagrid_status_label',
  },
  {
    id: 'quota',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {convertOctets(item.used)} / {convertOctets(item.available)}
      </OsdsText>
    ),
    label: 'zimbra_account_datagrid_quota',
  },
  {
    id: 'tooltip',
    cell: (item: EmailsItem) => <ActionButtonEmail emailsItem={item} />,
    label: '',
  },
];

export default function EmailAccounts() {
  const { t } = useTranslation(['accounts', 'dashboard']);
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();
  const isOverridedPage = useOverridePage();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useAccountList({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const { data: dataDomains } = useDomains({
    enabled: !isLoading && data?.length === 0,
  });

  const items: EmailsItem[] =
    data?.map((item: AccountType) => ({
      id: item.id,
      email: item.currentState.email,
      offer: item.currentState.offer,
      organizationId: item.currentState.organizationId,
      organizationLabel: item.currentState.organizationLabel,
      used: item.currentState.quota.used,
      available: item.currentState.quota.available,
      status: item.resourceStatus,
    })) ?? [];

  const accountsStatistics: AccountStatistics[] = organisation
    ? organisation.currentState.accountsStatistics
    : platform?.currentState?.accountsStatistics;

  const webmailUrl = guidesConstants.GUIDES_LIST.webmail.url;

  const hrefAddEmailAccount = useGenerateUrl('./add', 'href');

  return (
    <div className="py-6 mt-8">
      <Notifications />
      <Outlet />
      {platformUrn && !isOverridedPage && (
        <>
          <div className="mb-8 flex gap-8">
            <div>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                hue={ODS_TEXT_COLOR_HUE._500}
                size={ODS_TEXT_SIZE._200}
                className="font-bold mr-4"
              >
                {t('zimbra_account_datagrid_webmail_label')}
              </OsdsText>
              <Links
                href={webmailUrl}
                type={LinkType.external}
                label={webmailUrl}
                target={OdsHTMLAnchorElementTarget._blank}
              ></Links>
            </div>
            <div>
              <ManagerText
                className="flex gap-8"
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.account.get]}
              >
                {accountsStatistics?.length > 0
                  ? accountsStatistics?.map((stats: AccountStatistics) => (
                      <div key={stats.offer}>
                        <OsdsText
                          color={ODS_THEME_COLOR_INTENT.text}
                          hue={ODS_TEXT_COLOR_HUE._500}
                          size={ODS_TEXT_SIZE._200}
                          className="font-bold mr-4"
                        >
                          {`Zimbra ${stats.offer.toLowerCase()} :`}
                        </OsdsText>
                        <span>{`${
                          stats.configuredAccountsCount
                        } / ${stats.configuredAccountsCount +
                          stats.availableAccountsCount}`}</span>
                      </div>
                    ))
                  : t(
                      'zimbra_dashboard_tile_serviceConsumption_noAccountOffer',
                      { ns: 'dashboard' },
                    )}
              </ManagerText>
            </div>
          </div>
          {(data?.length > 0 || dataDomains?.length > 0) && (
            <ManagerButton
              color={ODS_THEME_COLOR_INTENT.primary}
              inline
              size={ODS_BUTTON_SIZE.sm}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.account.create]}
              href={hrefAddEmailAccount}
              data-testid="add-account-btn"
              className="mb-6"
            >
              <span slot="start">
                <OsdsIcon
                  name={ODS_ICON_NAME.PLUS}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  contrasted
                ></OsdsIcon>
              </span>
              <span slot="end">{t('zimbra_account_account_add')}</span>
            </ManagerButton>
          )}
          {dataDomains?.length === 0 && (
            <OsdsTooltip className="mb-6">
              <OsdsButton
                color={ODS_THEME_COLOR_INTENT.primary}
                inline
                size={ODS_BUTTON_SIZE.sm}
                disabled
              >
                <span slot="start">
                  <OsdsIcon
                    name={ODS_ICON_NAME.PLUS}
                    size={ODS_ICON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    contrasted
                  ></OsdsIcon>
                </span>
                <span slot="end">{t('zimbra_account_account_add')}</span>
              </OsdsButton>
              <OsdsTooltipContent slot="tooltip-content">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                >
                  {t('zimbra_domains_tooltip_need_domain')}
                </OsdsText>
              </OsdsTooltipContent>
            </OsdsTooltip>
          )}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Datagrid
                columns={columns.map((column) => ({
                  ...column,
                  label: t(column.label),
                }))}
                items={items}
                totalItems={items.length}
                hasNextPage={!isFetchingNextPage && hasNextPage}
                onFetchNextPage={fetchNextPage}
              />
              {isFetchingNextPage && <Loading />}
            </>
          )}
        </>
      )}
    </div>
  );
}
