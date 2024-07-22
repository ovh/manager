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

export default function Listing() {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  const columns = [
    {
      id: 'name',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <Links
            onClickReturn={() => navigate(`/${vdcOrg.id}`)}
            label={vdcOrg.currentState?.fullName}
          ></Links>
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_name'),
    },
    {
      id: 'location',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <RegionLabel code={vdcOrg.currentState?.region} />
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_location'),
    },
    {
      id: 'description',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>{vdcOrg.currentState?.description}</DataGridTextCell>
      ),
      label: t('managed_vcd_listing_description'),
    },
    {
      id: 'webInterfaceURL',
      cell: (vdcOrg: IVcdOrganization) => (
        <DataGridTextCell>
          <Links
            href={vdcOrg.currentState?.webInterfaceUrl}
            type={LinkType.external}
            label={vdcOrg.currentState?.webInterfaceUrl}
          />
        </DataGridTextCell>
      ),
      label: t('managed_vcd_listing_web_interface_url'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: t('managed_vcd_listing_title'),
    containerId: 'organizations',
    route: {
      api: '/vmwareCloudDirector/organization',
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
