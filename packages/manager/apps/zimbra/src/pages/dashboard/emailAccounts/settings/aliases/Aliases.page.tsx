import React, { useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus } from '@/components';
import { AliasType } from '@/data/api';
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
    cell: (item: AliasItem) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.alias}</OdsText>,
    label: 'common:alias',
    isSearchable: true,
  },
  {
    id: 'status',
    cell: (item: AliasItem) => <BadgeStatus status={item.status}></BadgeStatus>,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: (item: AliasItem) => <ActionButtonAlias item={item} />,
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
};

export default Aliases;
