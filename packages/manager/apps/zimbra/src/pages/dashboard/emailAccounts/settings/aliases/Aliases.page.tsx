import React, { useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus } from '@/components';
import { AliasType, ResourceStatus } from '@/data/api';
import { useAliases, usePlatform } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl } from '@/hooks';
import { EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButtonAlias from './ActionButton.component';
import { AliasItem } from './Aliases.types';

const columns: DatagridColumn<AliasItem>[] = [
  {
    id: 'alias',
    accessorKey: 'alias',
    label: 'common:alias',
    isSearchable: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    cell: ({ getValue }) => (
      <BadgeStatus status={getValue<keyof typeof ResourceStatus>()}></BadgeStatus>
    ),
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    maxSize: 50,
    cell: ({ row }) => <ActionButtonAlias item={row.original} />,
    label: '',
  },
];

export const Aliases = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common', NAMESPACES.STATUS]);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const { data, isLoading, hasNextPage, fetchNextPage, fetchAllPages } = useAliases({
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
        <Text preset={TEXT_PRESET.heading3}>{t('zimbra_account_alias_title')}</Text>
      </div>
      <Datagrid
        topbar={
          <Button
            id="add-alias-btn"
            color={BUTTON_COLOR.primary}
            size={BUTTON_SIZE.sm}
            onClick={handleAddAliasClick}
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.alias.create]}
            data-testid="add-alias-btn"
          >
            <>
              <Icon name={ICON_NAME.plus} />
              {t('common:add_alias')}
            </>
          </Button>
        }
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        columns={columns.map((column) => ({
          ...column,
          header: t(column.label),
        }))}
        data={items}
        totalCount={items.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
      />
    </div>
  );
};

export default Aliases;
