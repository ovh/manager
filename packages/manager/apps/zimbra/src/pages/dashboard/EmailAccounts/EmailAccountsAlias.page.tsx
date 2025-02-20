import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
import { EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constant';

export type AliasItem = {
  id: string;
  alias: string;
  status: ResourceStatus;
};

export default function EmailAccountsAlias() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.alias}</OdsText>
      ),
      label: 'common:alias',
    },
    {
      id: 'status',
      cell: (item: AliasItem) => (
        <BadgeStatus itemStatus={item.status}></BadgeStatus>
      ),
      label: 'common:status',
    },
    {
      id: 'tooltip',
      cell: (item: AliasItem) => <ActionButtonAlias aliasItem={item} />,
      label: '',
    },
  ];

  const hrefAddAlias = useGenerateUrl('./add', 'path', params);
  const handleAddAliasClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS],
    });
    navigate(hrefAddAlias);
  };
  const items: AliasItem[] =
    data?.map((item: AliasType) => ({
      id: item.id,
      alias: item.currentState.alias,
      status: item.resourceStatus,
    })) ?? [];

  return (
    <div>
      <Outlet />
      {platformUrn && (
        <>
          <div className="mb-8">
            <Subtitle>{t('zimbra_account_alias_title')}</Subtitle>
          </div>
          <div className="flex items-center justify-between">
            <ManagerButton
              id="add-alias-btn"
              className="mb-6"
              color={ODS_BUTTON_COLOR.primary}
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleAddAliasClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.alias.create]}
              data-testid="add-alias-btn"
              icon={ODS_ICON_NAME.plus}
              label={t('common:add_alias')}
            ></ManagerButton>
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
