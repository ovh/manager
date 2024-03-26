import { useEffect, useMemo, useState } from 'react';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { database } from '@/models/database';
import UpdateForm from './_components/update-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useServiceData } from '../../layout';
import {
  FullCapabilities,
  useGetAvailabilities,
  useGetFullCapabilities,
} from '@/hooks/api/availabilities.api.hooks';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { useVrack } from '@/hooks/useVrack';
import { Network } from '@/models/network';
import { useQueryState } from '@/hooks/useQueryState';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/settings/update"
    />
  );
}

export interface UpdateInitialValue extends database.Suggestion {
  networkType?: database.NetworkTypeEnum;
  networkId?: string;
  subnetId?: string;
}

const getTarget = (type: string) => {
  switch (type) {
    case 'version':
      return database.TargetEnum.version;
    case 'plan':
      return database.TargetEnum.plan;
    case 'flavor':
      return database.TargetEnum.flavor;
    default:
      return undefined;
  }
};

const UpdateService = () => {
  const [type] = useQueryState('target');
  const { projectId, service } = useServiceData();
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    getTarget(type),
  );
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const catalogQuery = useGetCatalog();
  const [network, setNetwork] = useState<Network | undefined>();
  const networkData = useVrack(projectId, service.nodes[0].region, network?.id);
  const [initialValue, setInitialValue] = useState<UpdateInitialValue>({
    default: true,
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

  return (
    <>
      <h3>Update</h3>
      <p>Update your service here</p>

      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <UpdateForm
          availabilities={availabilitiesQuery.data}
          capabilities={capabilities}
          initialValue={initialValue}
          catalog={catalogQuery.data}
        />
      )}
    </>
  );
};

export default UpdateService;
