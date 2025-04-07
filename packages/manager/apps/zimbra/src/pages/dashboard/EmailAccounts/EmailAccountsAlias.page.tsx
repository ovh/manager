import React, { useMemo } from 'react';
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
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { AliasType } from '@/api/alias';
import { useDebouncedValue, useGenerateUrl, usePlatform } from '@/hooks';
import ActionButtonAlias from './ActionButtonAlias.component';
import { BadgeStatus } from '@/components/BadgeStatus';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constant';
import { useAliases } from '@/hooks/useAliases';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

export type AliasItem = {
  id: string;
  alias: string;
  status: ResourceStatus;
};

const columns: DatagridColumn<AliasItem>[] = [
  {
    id: 'alias',
    cell: (item: AliasItem) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.alias}</OdsText>
    ),
    label: 'common:alias',
    isSearchable: true,
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

export default function EmailAccountsAlias() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common']);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();

  const [
    searchInput,
    setSearchInput,
    debouncedSearchInput,
    setDebouncedSearchInput,
  ] = useDebouncedValue('');

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    fetchAllPages,
  } = useAliases({
    alias: debouncedSearchInput,
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });

  const hrefAddAlias = useGenerateUrl('./add', 'path');

  const handleAddAliasClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS],
    });
    navigate(hrefAddAlias);
  };

  const items: AliasItem[] = useMemo(() => {
    return (
      data?.map((item: AliasType) => ({
        id: item.id,
        alias: item.currentState?.alias?.name,
        status: item.resourceStatus,
      })) ?? []
    );
  }, [data]);

  return (
    <div>
      <Outlet />
      <div className="mb-6">
        <Subtitle>{t('zimbra_account_alias_title')}</Subtitle>
      </div>
      <Datagrid
        topbar={
          <ManagerButton
            id="add-alias-btn"
            color={ODS_BUTTON_COLOR.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={handleAddAliasClick}
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.alias.create]}
            data-testid="add-alias-btn"
            icon={ODS_ICON_NAME.plus}
            label={t('common:add_alias')}
          />
        }
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={items.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
      />
    </div>
  );
}
