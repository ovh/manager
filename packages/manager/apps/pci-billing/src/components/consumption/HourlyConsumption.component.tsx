import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '@/constants';
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
import { TConsumptionType } from '@/api/data/consumption';

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
      key: TConsumptionType.instance,
      title: t('cpbc_hourly_instance_detail_title'),
      component: (
        <InstanceList
          billingInstances={consumption.hourlyInstances}
          colNameLabel={t('cpbc_hourly_instance_col_name')}
          colTotalLabel={t('cpbc_hourly_instance_col_consumption')}
        />
      ),
    },
    {
      key: TConsumptionType.snapshot,
      title: t('cpbc_snapshot_detail_title'),
      component: <SnapshotList snapshots={consumption.snapshots} />,
    },
    {
      key: TConsumptionType.volume,
      title: t('cpbc_volume_detail_title'),
      component: <VolumeList volumes={consumption.volumes} />,
    },
    {
      key: TConsumptionType.objectStorage,
      title: t('cpbc_object_storage_detail_title'),
      component: <ObjectStorageList storages={consumption.objectStorages} />,
    },

    {
      key: TConsumptionType.archiveStorage,
      title: t('cpbc_archive_storage_detail_title'),
      component: <ArchiveStorageList storages={consumption.archiveStorages} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.coldArchive,
      title: t('cpbc_cold_archive_detail_title'),
      component: <ColdArchiveList coldArchives={consumption.coldArchive} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.bandwidth,
      title: t('cpbc_hourly_instance_trafic_title'),
      component: (
        <OutgoingTrafficList
          instanceBandwidths={consumption.bandwidthByRegions}
        />
      ),
    },
    {
      key: TConsumptionType.privateRegistry,
      title: t('cpbc_hourly_private_registry_title'),
      component: (
        <ResourceUsageList resourcesUsage={consumption.privateRegistry} />
      ),
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.rancher,
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
      key: TConsumptionType.kubernetesLoadBalancer,
      title: PRODUCTS.KUBERNETES_LOAD_BALANCER,
      component: (
        <ResourceUsageList
          resourcesUsage={consumption.kubernetesLoadBalancer}
        />
      ),
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.training,
      title: t('cpbc_hourly_training_title'),
      component: <ResourceUsageList resourcesUsage={consumption.training} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.notebooks,
      title: t('cpbc_hourly_notebooks_title'),
      component: <ResourceUsageList resourcesUsage={consumption.notebooks} />,
    },
    {
      key: TConsumptionType.aiDeploy,
      title: t('cpbc_hourly_ai_deploy_title'),
      component: <ResourceUsageList resourcesUsage={consumption.aiDeploy} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.aiEndpoints,
      title: t('cpbc_hourly_ai_endpoints_title'),
      component: <AiEndpointList resourcesUsage={consumption.aiEndpoints} />,
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
      key: 'databases',
      title: t('cpbc_hourly_databases_title'),
      component: <ResourceUsageList resourcesUsage={consumption.databases} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.floatingip,
      title: t('cpbc_hourly_floating_ip_title'),
      component: <ResourceUsageList resourcesUsage={consumption.floatingIP} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.publicip,
      title: t('cpbc_hourly_public_ip_title'),
      component: <ResourceUsageList resourcesUsage={consumption.publicIP} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.gateway,
      title: t('cpbc_hourly_gateway_title'),
      component: <ResourceUsageList resourcesUsage={consumption.gateway} />,
      condition: !isTrustedZone,
    },
    {
      key: TConsumptionType.octaviaLoadbalancer,
      title: PRODUCTS.OCTAVIA_LOAD_BALANCER,
      component: (
        <ResourceUsageList resourcesUsage={consumption.octaviaLoadBalancer} />
      ),
      condition: !isTrustedZone,
    },
  ];

  const renderAccordion = (
    key: TConsumptionType,
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
        {`${title} (${consumption.totals.hourly[key].toFixed(2)} ${
          currency.symbol
        })`}
      </OsdsText>
      {component}
    </OsdsAccordion>
  );

  return (
    <div className="flex flex-col gap-5">
      {items
        .filter((item) => item.condition !== false)
        .map(({ key, title, component }) =>
          renderAccordion(key, title, component),
        )}
    </div>
  );
}
