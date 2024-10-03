import React from 'react';
import { useParams, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import VcdDashboardLayout from '@/components/dashboard/layout/VcdDashboardLayout.component';
import { useManagedVcdDatacentre } from '@/data/hooks/useManagedVcdDatacentres';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { COMPUTE_TITLE, STORAGE_TITLE } from './DatacentreDashboard.constant';

function DatacentreDashboardPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdDatacentre } = useManagedVcdDatacentre(id, vdcId);
  const { data: vcdOrganization } = useManagedVcdOrganization({ id });

  const tabsList = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'compute',
      title: COMPUTE_TITLE,
      to: useResolvedPath('compute').pathname,
    },
    {
      name: 'storage',
      title: STORAGE_TITLE,
      to: useResolvedPath('storage').pathname,
    },
  ];

  const serviceName = vcdDatacentre?.data?.currentState?.description ?? vdcId;
  const hasServiceRenamed = vdcId !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: vdcId,
        title: serviceName,
      }
    : { title: vdcId };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: vcdOrganization?.data?.currentState?.fullName,
    },
    {
      id: 'datacentres',
      label: t('managed_vcd_dashboard_datacentres_label'),
    },
    {
      id: vdcId,
      label: serviceName,
    },
  ];

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      breadcrumbItems={breadcrumbItems}
      header={header}
    />
  );
}

export default DatacentreDashboardPage;
