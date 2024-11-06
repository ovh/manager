import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  DataGridTextCell,
  Links,
  LinkType,
  Region,
} from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  vcdOrganizationListQueryKey,
  VCD_ORGANIZATION_ROUTE,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { urls } from '@/routes/routes.constant';

/* ========= datagrid cells ========== */
const DatagridIdCell = (vdcOrg: VCDOrganization) => {
  const navigate = useNavigate();
  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => navigate(`/${vdcOrg.id}`)}
        label={vdcOrg.currentState?.fullName}
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

const DatagridWebInterfaceCell = (vdcOrg: VCDOrganization) => (
  <DataGridTextCell>
    <Links
      href={vdcOrg.currentState?.webInterfaceUrl}
      type={LinkType.external}
      label={vdcOrg.currentState?.webInterfaceUrl}
      target={OdsHTMLAnchorElementTarget._blank}
    />
  </DataGridTextCell>
);

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
  ];

  return (
    <DatagridContainer
      title={t('managed_vcd_listing_title')}
      queryKey={vcdOrganizationListQueryKey}
      route={{
        api: VCD_ORGANIZATION_ROUTE,
        onboarding: urls.onboarding,
      }}
      columns={columns}
    />
  );
}
