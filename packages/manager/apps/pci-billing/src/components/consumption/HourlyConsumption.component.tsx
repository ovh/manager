import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS, ResourceType, ConsumptionKey } from '@/constants';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import ArchiveStorageList from './ArchiveStorageList.component';
import ColdArchiveList from './ColdArchiveList.component';
import InstanceList from './InstanceList.component';
import ObjectStorageList from './ObjectStorageList.component';
import OutgoingTrafficList from './OutgoingTrafficList.component';
import ResourceUsageList from './ResourceUsageList.component';
import SnapshotList from './SnapshotList.component';
import VolumeList from './VolumeList.component';
import { ResourcesColumn } from './useResourceUsageListColumns';
import AiEndpointList from './AiEndpointList.component';
import DataPlatformUsageList from './DataPlatformUsageList.component';

type HourlyConsumptionProps = {
  consumption: TConsumptionDetail;
  isTrustedZone: boolean;
};

export default function HourlyConsumption({
  consumption,
  isTrustedZone,
}: Readonly<HourlyConsumptionProps>) {
  const { t } = useTranslation('consumption/hourly-instance');

  const { currency } = useContext(ShellContext).environment.getUser();

  const items = [
    {
      key: ResourceType.INSTANCE,
      title: t('cpbc_hourly_instance_detail_title'),
      component: (
        <InstanceList
          billingInstances={consumption.hourlyInstances}
          colNameLabel={t('cpbc_hourly_instance_col_name')}
          colTotalLabel={t('cpbc_hourly_instance_col_consumption')}
        />
      ),
      condition: true,
    },
    {
      key: ResourceType.SNAPSHOT,
      title: t('cpbc_snapshot_detail_title'),
      component: <SnapshotList snapshots={consumption.snapshots} />,
      condition: true,
    },
    {
      key: ResourceType.VOLUME,
      title: t('cpbc_volume_detail_title'),
      component: <VolumeList volumes={consumption.volumes} />,
      condition: true,
    },
    {
      key: ResourceType.OBJECT_STORAGE,
      title: t('cpbc_object_storage_detail_title'),
      component: <ObjectStorageList storages={consumption.objectStorages} />,
      condition: true,
    },

    {
      key: ResourceType.ARCHIVE_STORAGE,
      title: t('cpbc_archive_storage_detail_title'),
      component: <ArchiveStorageList storages={consumption.archiveStorages} />,
      condition: !isTrustedZone,
    },
    {
      key: 'coldArchive',
      title: t('cpbc_cold_archive_detail_title'),
      component: <ColdArchiveList coldArchives={consumption.coldArchive} />,
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.BANDWIDTH,
      title: t('cpbc_hourly_instance_trafic_title'),
      component: (
        <OutgoingTrafficList
          instanceBandwidths={consumption.bandwidthByRegions}
        />
      ),
      condition: true,
    },
    {
      key: 'privateRegistry',
      title: t('cpbc_hourly_private_registry_title'),
      component: (
        <ResourceUsageList resourcesUsage={consumption.privateRegistry} />
      ),
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.RANCHER,
      title: t('cpbc_hourly_rancher_title'),
      component: (
        <ResourceUsageList
          resourcesUsage={consumption.rancher}
          disabledColumns={[ResourcesColumn.region]}
        />
      ),
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.MANAGED_KUBERNETES_SERVICE,
      title: t('cpbc_hourly_managed_kubernetes_service_title'),
      component: (
        <ResourceUsageList
          resourcesUsage={consumption.managedKubernetesService}
        />
      ),
      condition: !isTrustedZone,
    },
    {
      key: 'kubernetesLoadBalancer',
      title: PRODUCTS.KUBERNETES_LOAD_BALANCER,
      component: (
        <ResourceUsageList
          resourcesUsage={consumption.kubernetesLoadBalancer}
        />
      ),
      condition: !isTrustedZone,
    },
    {
      key: 'training',
      title: t('cpbc_hourly_training_title'),
      component: <ResourceUsageList resourcesUsage={consumption.training} />,
      condition: !isTrustedZone,
    },
    {
      key: 'notebooks',
      title: t('cpbc_hourly_notebooks_title'),
      component: <ResourceUsageList resourcesUsage={consumption.notebooks} />,
      condition: true,
    },
    {
      key: 'aiDeploy',
      title: t('cpbc_hourly_ai_deploy_title'),
      component: <ResourceUsageList resourcesUsage={consumption.aiDeploy} />,
      condition: !isTrustedZone,
    },
    {
      key: 'aiEndpoints',
      title: t('cpbc_hourly_ai_endpoints_title'),
      component: <AiEndpointList resourcesUsage={consumption.aiEndpoints} />,
      condition: !isTrustedZone,
    },
    {
      key: 'quantum',
      title: t('cpbc_hourly_quantum_title'),
      component: <ResourceUsageList resourcesUsage={consumption.quantum} />,
      condition: !isTrustedZone,
    },
    {
      key: 'dataProcessing',
      title: t('cpbc_hourly_data_processing_title'),
      component: (
        <ResourceUsageList resourcesUsage={consumption.dataProcessing} />
      ),
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.DATAPLATFORM,
      title: t('cpbc_hourly_data_platform_title'),
      component: (
        <DataPlatformUsageList resourcesUsage={consumption.dataplatform} />
      ),
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.DATABASES,
      title: t('cpbc_hourly_databases_title'),
      component: <ResourceUsageList resourcesUsage={consumption.databases} />,
      condition: !isTrustedZone,
    },
    {
      key: 'floatingIP',
      title: t('cpbc_hourly_floating_ip_title'),
      component: <ResourceUsageList resourcesUsage={consumption.floatingIP} />,
      condition: !isTrustedZone,
    },
    {
      key: 'publicIP',
      title: t('cpbc_hourly_public_ip_title'),
      component: <ResourceUsageList resourcesUsage={consumption.publicIP} />,
      condition: !isTrustedZone,
    },
    {
      key: ResourceType.GATEWAY,
      title: t('cpbc_hourly_gateway_title'),
      component: <ResourceUsageList resourcesUsage={consumption.gateway} />,
      condition: !isTrustedZone,
    },
    {
      key: 'octaviaLoadBalancer',
      title: PRODUCTS.OCTAVIA_LOAD_BALANCER,
      component: (
        <ResourceUsageList resourcesUsage={consumption.octaviaLoadBalancer} />
      ),
      condition: !isTrustedZone,
    },
  ] as const;

  const renderAccordion = (
    key: ConsumptionKey,
    title: string,
    component: React.ReactNode,
  ) => (
    <OsdsAccordion key={key}>
      <OsdsText
        size={ODS_TEXT_SIZE._500}
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot="summary"
        className="my-2"
      >
        {`${title} (${(consumption.totals.hourly[key] ?? 0).toFixed(2)} ${
          currency.symbol
        })`}
      </OsdsText>
      {component}
    </OsdsAccordion>
  );

  return (
    <div className="flex flex-col gap-5">
      {items
        .filter((item) => item.condition)
        .map(({ key, title, component }) =>
          renderAccordion(key, title, component),
        )}
    </div>
  );
}
