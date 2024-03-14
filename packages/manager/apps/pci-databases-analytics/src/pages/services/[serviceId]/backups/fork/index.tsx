import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FullCapabilities,
  useGetAvailabilities,
  useGetFullCapabilities,
} from '@/hooks/api/availabilities.api.hooks';
import { useServiceData } from '../../layout';
import { database } from '@/models/database';
import { H2, P } from '@/components/typography';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import ForkForm from './_components/fork-form';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';
import { useVrack } from '@/hooks/useVrack';
import { Network } from '@/models/network';
import { ForkSource, ForkSourceType } from '@/models/order-funnel';

export function breadcrumb() {
  return 'Fork';
}

export interface ForkInitialValue extends database.Suggestion {
  source: ForkSource;
  networkType?: database.NetworkTypeEnum;
  networkId?: string;
  subnetId?: string;
}

const Fork = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups/fork',
  );
  const { projectId, service } = useServiceData();
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.fork,
  );
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const backupsQuery = useGetBackups(projectId, service.engine, service.id);
  const catalogQuery = useGetCatalog();
  const [network, setNetwork] = useState<Network | undefined>();
  const networkData = useVrack(projectId, service.nodes[0].region, network?.id);
  const location = useLocation();
  const [initialValue, setInitialValue] = useState<ForkInitialValue>({
    default: true,
    source: {
      serviceId: service.id,
      type: ForkSourceType.backup,
      backupId: new URLSearchParams(location.search).get('backup') || undefined,
    },
    engine: service.engine,
    flavor: service.flavor,
    plan: service.plan,
    region: service.nodes[0].region,
    version: service.version,
    networkType: service.networkType,
    subnetId: service.subnetId,
  });

  // the 'networkid' in the service actually is the openstackId
  // we need to wait for the network query to be done in order to find the equivalent
  // network to update the initialValue
  useEffect(() => {
    if (service.networkId && networkData.networks.length > 0) {
      const networkFromId = networkData.networks.find((n) =>
        n.regions.find((r) => r.openstackId === service.networkId),
      );
      if (networkFromId) {
        setNetwork(networkFromId);
        setInitialValue((prev) => ({
          ...prev,
          networkId: networkFromId.id,
        }));
      }
    }
  }, [networkData.networks, service.networkId]);

  // Global network loading state
  const isNetworkLoading =
    service.networkType === database.NetworkTypeEnum.private &&
    !networkData.subnetQuery.isSuccess;
  const loading =
    availabilitiesQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    backupsQuery.isLoading ||
    isNetworkLoading ||
    catalogQuery.isLoading;

  // Add the current tag to selected capabilities.
  const capabilities: FullCapabilities = useMemo(() => {
    if (!capabilitiesQuery.data)
      return {
        flavors: [],
        disks: [],
        engines: [],
        options: [],
        plans: [],
        regions: [],
      };
    const { flavors, plans, regions, ...rest } = capabilitiesQuery.data;
    const updateTags = (
      items:
        | database.capabilities.Flavor[]
        | database.capabilities.Plan[]
        | database.RegionCapabilities[],
      serviceValue: string,
    ) =>
      items.map((item) =>
        item.name === serviceValue &&
        !item.tags.includes(database.capabilities.Tags.current)
          ? {
              ...item,
              tags: [...item.tags, database.capabilities.Tags.current],
            }
          : item,
      );
    return {
      ...rest,
      flavors: updateTags(flavors, service.flavor),
      plans: updateTags(plans, service.plan),
      regions: updateTags(regions, service.nodes[0].region),
    } as FullCapabilities;
  }, [capabilitiesQuery.data, service]);

  const backups =
    backupsQuery.data?.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ) || [];

  return (
    <>
      <H2>{t('title')}</H2>
      <P>{t('description')}</P>

      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <ForkForm
          availabilities={availabilitiesQuery.data}
          capabilities={capabilities}
          initialValue={initialValue}
          catalog={catalogQuery.data}
          backups={backups}
        />
      )}
    </>
  );
};

export default Fork;
