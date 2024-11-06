import React from 'react';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useVcdOrganization,
  useVcdDatacentre,
  getVcdDatacentreListQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import VcdDashboardLayout from '@/components/dashboard/layout/VcdDashboardLayout.component';
import { COMPUTE_TITLE, STORAGE_TITLE } from './DatacentreDashboard.constant';
import { subRoutes, urls } from '@/routes/routes.constant';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { isUpdatingTargetSpec } from '@/utils/refetchConditions';

function DatacentreDashboardPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const navigate = useNavigate();
  useAutoRefetch({
    queryKey: getVcdDatacentreListQueryKey(id),
    enabled: isUpdatingTargetSpec(vcdDatacentre?.data),
    interval: 4000,
  });

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
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() =>
        navigate(urls.datacentres.replace(subRoutes.dashboard, id))
      }
    />
  );
}

export default DatacentreDashboardPage;
