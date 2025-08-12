import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  DatagridColumn,
  DataGridTextCell,
  Links,
  LinkType,
  Region,
} from '@ovh-ux/manager-react-components';
import {
  vcdOrganizationListQueryKey,
  VCD_ORGANIZATION_ROUTE,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import {
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import OrganizationActions from './OrganizationActions.component';
import { MessageList } from '@/components/message/MessageList.component';
import { ORDER_VCD_REDIRECTION_URL } from '@/utils/orderVcdRedirection.constants';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '@/utils/label.constants';

const organizationMapper = (vdcOrgs?: VCDOrganization[]) => {
  return vdcOrgs?.map(({ id, currentState, resourceStatus }) => ({
    ...currentState,
    id,
    resourceStatus,
  }));
};

/* ========= datagrid cells ========== */
const DatagridIdCell = (
  vdcOrg: VCDOrganization['currentState'] & { id: string },
) => {
  const vcdDashboard = useHref(urls.dashboard);
  const { trackClick } = useOvhTracking();
  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => {
          trackClick(TRACKING.listing.details);
        }}
        href={vcdDashboard.replace(subRoutes.dashboard, vdcOrg.id)}
        label={vdcOrg?.fullName}
        data-testid={TEST_IDS.listingVcdNameLink}
      ></Links>
    </DataGridTextCell>
  );
};

const DatagridLocationCell = (vdcOrg: VCDOrganization['currentState']) => (
  <DataGridTextCell>
    <Region name={vdcOrg?.region?.toLowerCase()} mode="region" />
  </DataGridTextCell>
);

const DatagridRegionCell = (vdcOrg: VCDOrganization['currentState']) => (
  <DataGridTextCell>{vdcOrg?.region?.toLowerCase()}</DataGridTextCell>
);

const DatagridDescriptionCell = (vdcOrg: VCDOrganization['currentState']) => (
  <DataGridTextCell>{vdcOrg?.description}</DataGridTextCell>
);

const DatagridWebInterfaceCell = (vdcOrg: VCDOrganization['currentState']) => {
  const { t } = useTranslation('dashboard');
  return (
    <DataGridTextCell>
      <Links
        href={vdcOrg?.webInterfaceUrl}
        type={LinkType.external}
        label={t('managed_vcd_dashboard_management_interface_access')}
        target="_blank"
      />
    </DataGridTextCell>
  );
};

/* ======= listing page ======= */
export default function Listing() {
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();

  const { ovhSubsidiary } =
    useContext(ShellContext)?.environment?.getUser() || {};

  const columns = [
    {
      id: 'fullName',
      cell: DatagridIdCell,
      label: t('managed_vcd_listing_name'),
      isSortable: true,
      isFilterable: true,
      isSearchable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'location',
      cell: DatagridLocationCell,
      label: t('managed_vcd_listing_location'),
      isSortable: false,
      isFilterable: false,
      type: FilterTypeCategories.String,
    },
    {
      id: 'region',
      cell: DatagridRegionCell,
      label: t('managed_vcd_listing_region'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'description',
      cell: DatagridDescriptionCell,
      label: t('managed_vcd_listing_description'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'webInterfaceURL',
      cell: DatagridWebInterfaceCell,
      label: t('managed_vcd_listing_web_interface_url'),
      isSortable: false,
      isFilterable: false,
      type: FilterTypeCategories.String,
    },
    {
      id: 'actions',
      cell: OrganizationActions,
    },
  ] as DatagridColumn<unknown>[];

  return (
    <>
      <MessageList className="px-10" />
      <DatagridContainer
        title={VMWARE_CLOUD_DIRECTOR_LABEL}
        queryKey={vcdOrganizationListQueryKey}
        route={{
          api: VCD_ORGANIZATION_ROUTE,
          onboarding: urls.onboarding,
        }}
        columns={columns}
        columnsSearchable="fullName"
        mapper={organizationMapper}
        withFilter
        orderButton={
          <OdsButton
            label={t(`${NAMESPACES.ACTIONS}:order`)}
            variant="outline"
            onClick={() => {
              trackClick(TRACKING.common.order);
              window.open(
                ORDER_VCD_REDIRECTION_URL[ovhSubsidiary] ||
                  ORDER_VCD_REDIRECTION_URL.DEFAULT,
                '_blank',
              );
            }}
            data-testid={TEST_IDS.vcdOrderCta}
          />
        }
      />
      <Outlet />
    </>
  );
}
