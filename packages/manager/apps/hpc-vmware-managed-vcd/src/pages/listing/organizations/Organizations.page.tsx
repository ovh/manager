import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

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
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { MANAGED_VCD_LABEL } from '@/pages/dashboard/organization/organizationDashboard.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';

const organizationMapper = (vdcOrgs?: VCDOrganization[]) => {
  return vdcOrgs?.map(({ id, currentState }) => ({ ...currentState, id }));
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
  const { t } = useTranslation('listing');

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
  ] as DatagridColumn<unknown>[];

  return (
    <DatagridContainer
      title={MANAGED_VCD_LABEL}
      queryKey={vcdOrganizationListQueryKey}
      route={{
        api: VCD_ORGANIZATION_ROUTE,
        onboarding: urls.onboarding,
      }}
      columns={columns}
      columnsSearchable="fullName"
      mapper={organizationMapper}
      withFilter
    />
  );
}
