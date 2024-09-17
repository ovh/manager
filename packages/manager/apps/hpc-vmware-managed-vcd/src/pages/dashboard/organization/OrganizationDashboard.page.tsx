import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';

import VcdDashboardLayout from '@/components/dashboard/layout/VcdDashboardLayout.component';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const { data: vcdOrganisation } = useManagedVcdOrganization({ id });

  const tabsList = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'datacentres',
      title: t('managed_vcd_dashboard_datacentres_title'),
      to: useResolvedPath('datacentres').pathname,
    },
  ];

  const serviceName = vcdOrganisation?.data?.currentState?.fullName;
  const hasServiceRenamed = id !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: id,
        title: serviceName,
      }
    : { title: id };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: serviceName,
      onClick: () => navigate(`/${id}`),
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
