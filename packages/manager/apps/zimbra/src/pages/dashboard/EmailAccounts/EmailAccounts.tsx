import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  IconLinkAlignmentType,
  Links,
  LinkType,
  ManagerButton,
  ManagerText,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
import { GUIDES_LIST } from '@/guides.constants';
import ActionButtonEmail from './ActionButtonEmail.component';
import {
  convertOctets,
  DATAGRID_REFRESH_INTERVAL,
  DATAGRID_REFRESH_ON_MOUNT,
} from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import Loading from '@/components/Loading/Loading';
import { BadgeStatus } from '@/components/BadgeStatus';
import { ResourceStatus, AccountStatistics } from '@/api/api.type';
import {
  ADD_EMAIL_ACCOUNT,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constant';
import { getZimbraPlatformListQueryKey } from '@/api/platform';
import queryClient from '@/queryClient';

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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.email}</OdsText>
    ),
    label: 'common:email_account',
  },
  {
    id: 'organization',
    cell: (item) => (
      <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
    ),
    label: 'common:organization',
  },
  {
    id: 'offer',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.offer}</OdsText>
    ),
    label: 'zimbra_account_datagrid_offer_label',
  },
  {
    id: 'quota',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {convertOctets(item.used)} / {convertOctets(item.available)}
      </OdsText>
    ),
    label: 'zimbra_account_datagrid_quota',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'common:status',
  },
  {
    id: 'tooltip',
    cell: (item: EmailsItem) => <ActionButtonEmail emailsItem={item} />,
    label: '',
  },
];

export default function EmailAccounts() {
  const { t } = useTranslation(['accounts', 'common']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const [hasADeletingAccount, setHasADeletingAccount] = useState(false);
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();
  const isOverridedPage = useOverridePage();
  const {
    data: accounts,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useAccountList({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  /* This is necessary to enable back the "Create account" button when your
   * slots are full and you delete an account and the account goes
   * from "DELETING" state to actually being deleted, because we invalidate
   * the cache when sending the delete request of the account but when it is
   * in "DELETING" state the slot is not yet freed, to me it should be
   * but it requires changes on backend side */
  useEffect(() => {
    const current = accounts?.some(
      (account) => account.resourceStatus === ResourceStatus.DELETING,
    );
    if (hasADeletingAccount !== current) {
      if (!current) {
        queryClient.invalidateQueries({
          queryKey: getZimbraPlatformListQueryKey(),
        });
      }
      setHasADeletingAccount(current);
    }
  }, [accounts]);

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    enabled: !isLoading && accounts?.length === 0,
  });

  const items: EmailsItem[] =
    accounts?.map((item: AccountType) => ({
      id: item.id,
      email: item.currentState.email,
      offer: item.currentState.offer,
      organizationId: item.currentState.organizationId,
      organizationLabel: item.currentState.organizationLabel,
      used: item.currentState.quota.used,
      available: item.currentState.quota.available,
      status: item.resourceStatus,
    })) ?? [];

  const accountsStatistics: AccountStatistics[] = useMemo(() => {
    return organisation
      ? organisation.currentState?.accountsStatistics
      : platform?.currentState?.accountsStatistics;
  }, [organisation, platform]);

  const hasAvailableAccounts = useMemo(() => {
    return accountsStatistics
      ?.map((stats) => {
        return stats.availableAccountsCount > 0;
      })
      .some(Boolean);
  }, [accountsStatistics, platform, organisation]);

  const isAddAccountDisabled =
    isLoadingDomains || domains?.length === 0 || !hasAvailableAccounts;

  const webmailUrl = GUIDES_LIST.webmail.url.DEFAULT;

  const hrefAddEmailAccount = useGenerateUrl('./add', 'path');
  const hrefOrderEmailAccount = useGenerateUrl('./order', 'path');

  const handleAddEmailAccountClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_EMAIL_ACCOUNT],
    });
    navigate(hrefAddEmailAccount);
  };
  const handleOrderEmailAccountClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT],
    });
    navigate(hrefOrderEmailAccount);
  };

  return (
    <div>
      <Outlet />
      {platformUrn && !isOverridedPage && (
        <>
          <div className="mb-6 flex gap-8">
            <div>
              <OdsText
                preset={ODS_TEXT_PRESET.heading6}
                className="font-bold mr-4"
              >
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
                        <OdsText
                          preset={ODS_TEXT_PRESET.heading6}
                          className=" mr-4"
                        >
                          {`Zimbra ${stats.offer.toLowerCase()} :`}
                        </OdsText>
                        <span>{`${
                          stats.configuredAccountsCount
                        } / ${stats.configuredAccountsCount +
                          stats.availableAccountsCount}`}</span>
                      </div>
                    ))
                  : t('common:no_email_account_available')}
              </ManagerText>
            </div>
          </div>
          <div className="mb-6 flex gap-6">
            <div id="add-account-tooltip-trigger">
              <ManagerButton
                id="add-account-btn"
                color={ODS_BUTTON_COLOR.primary}
                size={ODS_BUTTON_SIZE.sm}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.account.create]}
                onClick={handleAddEmailAccountClick}
                data-testid="add-account-btn"
                icon={ODS_ICON_NAME.plus}
                label={t('zimbra_account_account_add')}
                isDisabled={isAddAccountDisabled}
              />
            </div>
            {isAddAccountDisabled && (
              <OdsTooltip triggerId="add-account-tooltip-trigger">
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t(
                    domains?.length === 0
                      ? 'zimbra_account_tooltip_need_domain'
                      : 'zimbra_account_tooltip_need_slot',
                  )}
                </OdsText>
              </OdsTooltip>
            )}
            <ManagerButton
              id="order-account-btn"
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.account.create]}
              data-testid="order-account-btn"
              color={ODS_BUTTON_COLOR.primary}
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleOrderEmailAccountClick}
              label={t('zimbra_account_account_order')}
            />
          </div>
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
