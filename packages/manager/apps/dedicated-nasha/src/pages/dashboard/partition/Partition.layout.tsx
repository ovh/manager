import React, { useContext, useMemo } from 'react';
import { Outlet, useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout } from '@ovh-ux/muk';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Tabs,
  TabList,
  Tab,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { usePartitionsAapi } from '@/hooks/nasha';
import { preparePartition } from '@/utils/nasha.utils';
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaServiceInfo, NashaPartition } from '@/types/nasha.type';

interface DashboardContext {
  nasha: Nasha & { localeDatacenter: string; diskSize: string };
  serviceInfo: NashaServiceInfo;
  serviceName: string;
}

export default function PartitionLayout() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const dashboardContext = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('partition');

  const { data: partitionsRaw, isLoading } = usePartitionsAapi(serviceName || '');

  // Prepare partitions and find current partition
  const partitions = useMemo(() => {
    if (!partitionsRaw) return [];
    return partitionsRaw.map((p) => preparePartition(p, t));
  }, [partitionsRaw, t]);

  const partition = useMemo(
    () => partitions.find((p) => p.partitionName === partitionName),
    [partitions, partitionName],
  );

  // Determine active tab
  const activeTab = useMemo(() => {
    if (location.pathname.includes('/accesses')) return 'accesses';
    if (location.pathname.includes('/snapshots')) return 'snapshots';
    return 'general';
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    if (!serviceName || !partitionName) return;

    if (value === 'general') {
      navigate(urls.partition(serviceName, partitionName));
    } else if (value === 'accesses') {
      navigate(urls.partitionAccesses(serviceName, partitionName));
    } else if (value === 'snapshots') {
      navigate(urls.partitionSnapshots(serviceName, partitionName));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!partition) {
    // Redirect to dashboard if partition not found
    navigate(urls.dashboard(serviceName!));
    return null;
  }

  return (
    <BaseLayout
      header={{
        title: partition.partitionName,
        description: dashboardContext.nasha.serviceName,
      }}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href={`#${urls.listing}`}>NAS-HA</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`#${urls.dashboard(serviceName!)}`}>
              {dashboardContext.nasha.customName || dashboardContext.nasha.serviceName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{partitionName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      tabs={
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabList>
            <Tab value="general">
              {t('nasha_dashboard_partition_tab_general_information')}
            </Tab>
            <Tab value="snapshots">
              {t('nasha_dashboard_partition_tab_snapshots')}
            </Tab>
            <Tab value="accesses">
              {t('nasha_dashboard_partition_tab_accesses')}
            </Tab>
          </TabList>
        </Tabs>
      }
    >
      <Outlet
        context={{
          ...dashboardContext,
          partition,
          partitions,
          partitionName,
        }}
      />
    </BaseLayout>
  );
}

