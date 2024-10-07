import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Notifications,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useSearchParams } from 'react-router-dom';
import {
  AliasType,
  getZimbraPlatformAlias,
  getZimbraPlatformAliasQueryKey,
} from '@/api/alias';
import { useGenerateUrl, usePlatform } from '@/hooks';
import ActionButtonAlias from './ActionButtonAlias.component';
import { BadgeStatus } from '@/components/BadgeStatus';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import Loading from '@/components/Loading/Loading';

export type AliasItem = {
  id: string;
  alias: string;
  status: ResourceStatus;
};

export default function EmailAccountsAlias() {
  const { t } = useTranslation('accounts/alias');
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const { platformId, platformUrn } = usePlatform();
  const { data, isLoading } = useQuery({
    queryKey: getZimbraPlatformAliasQueryKey(platformId),
    queryFn: () => getZimbraPlatformAlias(platformId),
    enabled: !!platformId,
  });

  const columns: DatagridColumn<AliasItem>[] = [
    {
      id: 'alias',
      cell: (item: AliasItem) => (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.alias}
        </OsdsText>
      ),
      label: 'zimbra_account_alias_datagrid_alias_label',
    },
    {
      id: 'status',
      cell: (item: AliasItem) => (
        <BadgeStatus itemStatus={item.status}></BadgeStatus>
      ),
      label: 'zimbra_account_alias_datagrid_status_label',
    },
    {
      id: 'tooltip',
      cell: (item: AliasItem) => <ActionButtonAlias aliasItem={item} />,
      label: '',
    },
  ];

  const hrefAddAlias = useGenerateUrl('./add', 'href', { editEmailAccountId });

  const items: AliasItem[] =
    data?.map((item: AliasType) => ({
      id: item.id,
      alias: item.currentState.alias,
      status: item.resourceStatus,
    })) ?? [];

  return (
    <div className="py-6 mt-8">
      <Outlet />
      <Notifications />
      {platformUrn && (
        <>
          <div className="mb-8">
            <Subtitle>{t('zimbra_account_alias_title')}</Subtitle>
          </div>
          <div className="flex items-center justify-between">
            <ManagerButton
              className="mb-6"
              color={ODS_THEME_COLOR_INTENT.primary}
              inline
              size={ODS_BUTTON_SIZE.sm}
              href={hrefAddAlias}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.alias.create]}
              data-testid="add-alias-btn"
            >
              <span slot="start">
                <OsdsIcon
                  name={ODS_ICON_NAME.PLUS}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  contrasted
                ></OsdsIcon>
              </span>
              <span slot="end">{t('zimbra_account_alias_cta')}</span>
            </ManagerButton>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={items}
              totalItems={items.length}
            />
          )}
        </>
      )}
    </div>
  );
}
