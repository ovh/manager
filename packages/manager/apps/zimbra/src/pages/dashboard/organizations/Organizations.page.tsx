import React from 'react';

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
import { Datagrid, DatagridColumn, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus, IdLink, LabelChip } from '@/components';
import { useOrganizations, usePlatform } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl, useOverridePage } from '@/hooks';
import { ADD_ORGANIZATION } from '@/tracking.constants';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButton from './ActionButton.component';
import { OrganizationItem } from './Organizations.types';

const columns: DatagridColumn<OrganizationItem>[] = [
  {
    id: 'name',
    cell: (item: OrganizationItem) => <IdLink id={item.id} label={item.name} />,
    label: 'zimbra_organization_name',
    isSearchable: true,
  },
  {
    id: 'label',
    cell: (item: OrganizationItem) =>
      item.label && <LabelChip id={item.id}>{item.label}</LabelChip>,
    label: 'zimbra_organization_label',
  },
  {
    id: 'account',
    cell: (item: OrganizationItem) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.account}</OdsText>
    ),
    label: 'zimbra_organization_account_number',
  },
  {
    id: 'status',
    cell: (item: OrganizationItem) => <BadgeStatus status={item.status} />,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: (item: OrganizationItem) => <ActionButton item={item} />,
    label: '',
  },
];

export default function Organizations() {
  const { t } = useTranslation(['organizations', NAMESPACES.STATUS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const isOverridedPage = useOverridePage();

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const { data, fetchAllPages, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useOrganizations({
      organizationName: debouncedSearchInput,
      refetchInterval: DATAGRID_REFRESH_INTERVAL,
      refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    });

  const items: OrganizationItem[] =
    data?.map((item) => ({
      id: item.id,
      name: item.currentState.name,
      label: item.currentState.label,
      account: item.currentState.accountsStatistics.reduce(
        (acc, current) => acc + current.configuredAccountsCount,
        0,
      ),
      status: item.resourceStatus,
    })) ?? [];

  const hrefAddOrganization = useGenerateUrl('./add', 'path');

  const handleOrganizationClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_ORGANIZATION],
    });
    navigate(hrefAddOrganization);
  };

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <Datagrid
          topbar={
            <ManagerButton
              id="add-organization-btn"
              color={ODS_BUTTON_COLOR.primary}
              inline-block
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleOrganizationClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.organization.create]}
              data-testid="add-organization-btn"
              icon={ODS_ICON_NAME.plus}
              label={t('common:add_organization')}
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
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          onFetchAllPages={fetchAllPages}
          isLoading={isLoading || isFetchingNextPage}
        />
      )}
    </div>
  );
}
