import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  DataGridTextCell,
  Links,
  LinkType,
} from '@ovhcloud/manager-components';

import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import RegionLabel from '@/components/region-label/RegionLabel.component';
import { urls } from '@/routes/routes.constant';
import IVcdOrganization from '@/types/vcd-organization.interface';
import { VCD_ORGANIZATION_ROUTE } from '@/data/api/hpc-vmware-managed-vcd.constants';

/* ========= datagrid cells ========== */
const DatagridIdCell = (vdcOrg: IVcdOrganization) => {
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

const DatagridRegionCell = (vdcOrg: IVcdOrganization) => (
  <DataGridTextCell>
    <RegionLabel code={vdcOrg.currentState?.region} />
  </DataGridTextCell>
);

const DatagridDescriptionCell = (vdcOrg: IVcdOrganization) => (
  <DataGridTextCell>{vdcOrg.currentState?.description}</DataGridTextCell>
);

const DatagridWebInterfaceCell = (vdcOrg: IVcdOrganization) => (
  <DataGridTextCell>
    <Links
      href={vdcOrg.currentState?.webInterfaceUrl}
      type={LinkType.external}
      label={vdcOrg.currentState?.webInterfaceUrl}
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
      cell: DatagridRegionCell,
      label: t('managed_vcd_listing_location'),
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

  const datagridProps: TDatagridContainerProps = {
    title: t('managed_vcd_listing_title'),
    containerId: 'organizations',
    route: {
      api: VCD_ORGANIZATION_ROUTE,
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
