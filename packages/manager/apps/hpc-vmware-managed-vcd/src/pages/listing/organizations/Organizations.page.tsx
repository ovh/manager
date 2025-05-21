import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import {
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
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { urls } from '@/routes/routes.constant';
import { MANAGED_VCD_LABEL } from '@/pages/dashboard/organization/organizationDashboard.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import OrganizationActions from './OrganizationActions.component';
import { MessageList } from '@/components/message/MessageList.component';

/* ========= datagrid cells ========== */
const DatagridIdCell = (vdcOrg: VCDOrganization) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => {
          trackClick(TRACKING.listing.details);
          navigate(`/${vdcOrg.id}`);
        }}
        label={vdcOrg.currentState?.fullName}
        data-testid={TEST_IDS.listingVcdNameLink}
      ></Links>
    </DataGridTextCell>
  );
};

const DatagridLocationCell = (vdcOrg: VCDOrganization) => (
  <DataGridTextCell>
    <Region name={vdcOrg.currentState?.region?.toLowerCase()} mode="region" />
  </DataGridTextCell>
);

const DatagridRegionCell = (vdcOrg: VCDOrganization) => (
  <DataGridTextCell>
    {vdcOrg.currentState?.region?.toLowerCase()}
  </DataGridTextCell>
);

const DatagridDescriptionCell = (vdcOrg: VCDOrganization) => (
  <DataGridTextCell>{vdcOrg.currentState?.description}</DataGridTextCell>
);

const DatagridWebInterfaceCell = (vdcOrg: VCDOrganization) => {
  const { t } = useTranslation('dashboard');
  return (
    <DataGridTextCell>
      <Links
        href={vdcOrg.currentState?.webInterfaceUrl}
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
      id: 'name',
      cell: DatagridIdCell,
      label: t('managed_vcd_listing_name'),
    },
    {
      id: 'location',
      cell: DatagridLocationCell,
      label: t('managed_vcd_listing_location'),
    },
    {
      id: 'region',
      cell: DatagridRegionCell,
      label: t('managed_vcd_listing_region'),
    },
    {
      id: 'description',
      cell: DatagridDescriptionCell,
      label: t('managed_vcd_listing_description'),
    },
    {
      id: 'webInterfaceURL',
      cell: DatagridWebInterfaceCell,
      label: t('managed_vcd_listing_web_interface_url'),
    },
    {
      id: 'actions',
      cell: OrganizationActions,
    },
  ];

  return (
    <>
      <MessageList className="px-10" />
      <DatagridContainer
        title={MANAGED_VCD_LABEL}
        queryKey={vcdOrganizationListQueryKey}
        route={{
          api: VCD_ORGANIZATION_ROUTE,
          onboarding: urls.onboarding,
        }}
        columns={columns}
      />
      <Outlet />
    </>
  );
}
