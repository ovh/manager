import { useMutation, useQuery } from '@tanstack/react-query';
import {
  COLD_ARCHIVE_GRID_DATA,
  ResourceType,
  getResourceDisplayKey,
  ConsumptionKey,
  RESOURCE_DISPLAY_NAMES,
} from '@/constants';
import queryClient from '@/queryClient';
import {
  activateMonthlyBilling,
  getCurrentUsage,
  TCurrentUsage,
  THourlyConsumptions,
  TQuantity,
} from '../data/consumption';

const roundPrice = (num: number, fractionDigits = 2) =>
  Number(num.toFixed(fractionDigits));

const initMonthlyInstanceList = (data: TCurrentUsage['monthlyUsage']) => {
  if (!data) {
    return {
      monthlyInstanceList: [],
      monthlyInstanceTotalPrice: 0,
    };
  }

  const monthlyInstanceList = data.instance.flatMap((instance) =>
    instance.details.map((detail) => ({
      ...detail,
      totalPrice: roundPrice(detail.totalPrice),
      reference: instance.reference,
      region: instance.region,
    })),
  ) as TInstance[];

  const monthlyInstanceTotalPrice = roundPrice(
    data.instance.reduce(
      (sum, instance) => sum + roundPrice(instance.totalPrice),
      0,
    ),
  );

  return {
    monthlyInstanceList,
    monthlyInstanceTotalPrice,
  };
};

const initMonthlySavingsPlanList = (
  data: TCurrentUsage['monthlyUsage'],
): {
  monthlySavingsPlanList: TSavingsPlan[];
  monthlySavingsPlanTotalPrice: number;
} => {
  if (!data) {
    return {
      monthlySavingsPlanList: [],
      monthlySavingsPlanTotalPrice: 0,
    };
  }

  const monthlySavingsPlanList = data.savingsPlan.flatMap((svp) =>
    svp.details.map((detail) => ({
      ...detail,
      totalPrice: roundPrice(detail.totalPrice.value),
      flavor: svp.flavor,
      size: detail.size,
    })),
  );

  const monthlySavingsPlanTotalPrice = roundPrice(
    data.savingsPlan.reduce(
      (sum, instance) => sum + roundPrice(instance.totalPrice.value),
      0,
    ),
  );

  return {
    monthlySavingsPlanList,
    monthlySavingsPlanTotalPrice,
  };
};

const initHourlyInstanceList = (data: TCurrentUsage) => {
  const { instance: instanceData } = data.hourlyUsage;
  if (!instanceData.length) {
    return { hourlyInstanceList: [], hourlyInstanceTotalPrice: 0 };
  }

  const hourlyInstanceList = instanceData.flatMap((instance) =>
    instance.details.map((detail) => ({
      ...detail,
      totalPrice: roundPrice(detail.totalPrice),
      reference: instance.reference,
      region: instance.region,
    })),
  ) as TInstance[];

  const hourlyInstanceTotalPrice = roundPrice(
    data.hourlyUsage.instance.reduce(
      (sum, instance) => sum + roundPrice(instance.totalPrice),
      0,
    ),
  );

  return {
    hourlyInstanceList,
    hourlyInstanceTotalPrice,
  };
};

const initObjectStorageList = (data: TCurrentUsage) => {
  const { storage: storageData } = data.hourlyUsage;
  if (!storageData.length) {
    return {
      objectStorageList: [],
      objectStorageTotalPrice: 0,
    };
  }

  const objectStorageList = storageData.filter(
    (storage) => storage.type !== 'pca',
  );

  const objectStorageTotalPrice = roundPrice(
    objectStorageList?.reduce(
      (sum, storage) => sum + roundPrice(storage.totalPrice),
      0,
    ) || 0,
  );

  return {
    objectStorageList,
    objectStorageTotalPrice,
  };
};

const initArchiveStorageList = (data: TCurrentUsage) => {
  const { storage: storageData } = data.hourlyUsage;
  if (!storageData.length) {
    return {
      archiveStorageList: [],
      archiveStorageTotalPrice: 0,
    };
  }

  const archiveStorageList = storageData.filter(
    (storage) => storage.type === 'pca',
  );

  const archiveStorageTotalPrice = roundPrice(
    archiveStorageList?.reduce(
      (sum, storage) => sum + roundPrice(storage.totalPrice),
      0,
    ),
  );

  return {
    archiveStorageList,
    archiveStorageTotalPrice,
  };
};

const initSnapshotList = (data: TCurrentUsage) => {
  const { snapshot } = data.hourlyUsage;
  if (!snapshot.length) {
    return {
      snapshotList: [],
      snapshotsTotalPrice: 0,
    };
  }

  const snapshotList = snapshot.map((snap) => ({
    ...snap,
    totalPrice: roundPrice(snap.totalPrice),
  }));

  const snapshotsTotalPrice = roundPrice(
    data.hourlyUsage.snapshot.reduce(
      (sum, snap) => sum + roundPrice(snap.totalPrice),
      0,
    ),
  );

  return {
    snapshotList,
    snapshotsTotalPrice,
  };
};

const initConsumptionsList = (
  consumptions: THourlyConsumptions[],
): {
  list: TResourceUsage[];
  totalPrice: number;
} => {
  if (!consumptions.length) {
    return {
      list: [],
      totalPrice: 0,
    };
  }

  const list = consumptions.flatMap((consumption) =>
    consumption.details.map((r) => ({
      ...r,
      totalPrice: roundPrice(r.totalPrice.value),
      name: consumption.reference,
      region: consumption.region,
    })),
  );

  const totalPrice = roundPrice(
    consumptions
      .flatMap((rancher) => rancher.details)
      .reduce((sum, rancher) => sum + roundPrice(rancher.totalPrice.value), 0),
  );

  return {
    list,
    totalPrice,
  };
};

const initVolumeList = (data: TCurrentUsage) => {
  if (!data.hourlyUsage.volume.length) {
    return {
      volumeList: [],
      volumesTotalPrice: 0,
    };
  }

  const volumeList = data.hourlyUsage.volume.flatMap((volume) =>
    volume.details.map((detail) => ({
      ...detail,
      totalPrice: roundPrice(detail.totalPrice),
      type: volume.type,
      region: volume.region,
    })),
  );

  const volumesTotalPrice = roundPrice(
    data.hourlyUsage.volume.reduce(
      (sum, volume) => sum + roundPrice(volume.totalPrice),
      0,
    ),
  );

  return {
    volumeList,
    volumesTotalPrice,
  };
};

const initInstanceBandwidth = (data: TCurrentUsage) => {
  const { instanceBandwidth } = data.hourlyUsage;
  if (!instanceBandwidth.length) {
    return {
      bandwidthList: [],
      bandwidthTotalPrice: 0,
    };
  }

  const bandwidthList = instanceBandwidth.map((bandwidthByRegion) => ({
    ...bandwidthByRegion,
    outgoingBandwidth: {
      ...bandwidthByRegion.outgoingBandwidth,
      totalPrice: roundPrice(bandwidthByRegion.outgoingBandwidth.totalPrice),
      quantity: {
        ...bandwidthByRegion.outgoingBandwidth.quantity,
        value: roundPrice(
          bandwidthByRegion.outgoingBandwidth.quantity.value || 0,
        ),
      },
    },
  }));

  const bandwidthTotalPrice = roundPrice(
    bandwidthList.reduce(
      (sum, item) => sum + item.outgoingBandwidth.totalPrice,
      0,
    ),
  );

  return {
    bandwidthList,
    bandwidthTotalPrice,
  };
};

const sumColdArchiveTotalPriceByName = (
  coldArchives: TConsumptionDetail['coldArchive'],
  name: string,
) =>
  coldArchives.reduce((sum, object) => {
    if (object.name === name) {
      return sum + object.totalPrice;
    }
    return sum;
  }, 0);

const sumColdArchiveBillingQuantitiesByName = (
  coldArchives: TConsumptionDetail['coldArchive'],
  name: string,
) =>
  coldArchives.reduce((sum, object) => {
    if (object.name === name) {
      return sum + object.quantity.value;
    }
    return sum;
  }, 0);

const reduceColdArchiveBillingInfo = (
  coldArchives: TConsumptionDetail['coldArchive'],
) =>
  Object.keys(COLD_ARCHIVE_GRID_DATA.FEE_TYPES).map((type) => {
    const name = type.toLowerCase();
    return {
      name,
      quantity: {
        value: sumColdArchiveBillingQuantitiesByName(coldArchives, name),
        unit:
          name === COLD_ARCHIVE_GRID_DATA.FEE_TYPES.RESTORE
            ? COLD_ARCHIVE_GRID_DATA.QUANTITY.UNIT
            : COLD_ARCHIVE_GRID_DATA.QUANTITY.HOUR,
      },
      totalPrice: sumColdArchiveTotalPriceByName(coldArchives, name),
      region: COLD_ARCHIVE_GRID_DATA.REGION,
    };
  });

const initResourceUsage = (data: TCurrentUsage, resourceType: ResourceType) => {
  let resources = data.resourcesUsage
    .filter((resource) => resource.type === resourceType)
    .flatMap((resource) => resource.resources)
    .flatMap((resourceDetail) =>
      resourceDetail.components.map((resourceComponent) => ({
        ...resourceComponent,
        region: resourceDetail.region,
      })),
    );

  if (resourceType === ResourceType.COLD_ARCHIVE) {
    resources = reduceColdArchiveBillingInfo(resources);
  }

  const totalPrice = roundPrice(
    resources.reduce((sum, item) => sum + item.totalPrice, 0),
  );

  return {
    resources,
    totalPrice: totalPrice || 0,
  };
};

export type TResourceUsage = {
  name: string;
  quantity: TQuantity;
  region: string;
  totalPrice: number;
};

export type TInstance = {
  instanceId: string;
  quantity: TQuantity;
  reference: string;
  region: string;
  totalPrice: number;
  activation: string;
};

export type TSavingsPlan = {
  id: string;
  size: string;
  flavor: string;
  totalPrice: number;
};

export type TVolume = {
  quantity: TQuantity;
  region: string;
  totalPrice: number;
  type: string;
  volumeId: string;
};

export type TInstanceBandWith = {
  incomingBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  outgoingBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  region: string;
  totalPrice: number;
};

export type TStorage = {
  bucketName: string;
  incomingBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  incomingInternalBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  outgoingBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  outgoingInternalBandwidth: {
    quantity: TQuantity;
    totalPrice: number;
  };
  retrievalFees?: {
    quantity: TQuantity;
    totalPrice: {
      value: number;
    };
  };
  region: string;
  stored: {
    quantity: TQuantity;
    totalPrice: number;
  };
  totalPrice: number;
  type: string;
};

export type TSnapshot = {
  instance: {
    quantity: TQuantity;
    totalPrice: 0;
  };
  region: string;
  totalPrice: number;
  volume: string | null;
};

export type TConsumptionDetail = {
  hourlyInstances: TInstance[];
  monthlyInstances: TInstance[];
  monthlySavingsPlanList: TSavingsPlan[];
  objectStorages: TStorage[];
  archiveStorages: TStorage[];
  snapshots: TSnapshot[];
  volumes: TVolume[];
  bandwidthByRegions: TInstanceBandWith[];
  privateRegistry: TResourceUsage[];
  rancher: TResourceUsage[];
  managedKubernetesService: TResourceUsage[];
  kubernetesLoadBalancer: TResourceUsage[];
  training: TResourceUsage[];
  aiEndpoints: TResourceUsage[];
  notebooks: TResourceUsage[];
  aiDeploy: TResourceUsage[];
  dataplatform: TResourceUsage[];
  coldArchive: TResourceUsage[];
  dataProcessing: TResourceUsage[];
  databases: TResourceUsage[];
  floatingIP: TResourceUsage[];
  publicIP: TResourceUsage[];
  gateway: TResourceUsage[];
  octaviaLoadBalancer: TResourceUsage[];
  totals: {
    total: number;
    hourly: Partial<Record<ConsumptionKey, number>>;
    monthly: {
      total: number;
      instance: number;
      savingsPlan: number;
    };
  };
};

const hourlyItems = [
  ...Object.values(ResourceType),
  ...Object.values(RESOURCE_DISPLAY_NAMES),
];

export const initializeTConsumptionDetail = (): TConsumptionDetail => ({
  hourlyInstances: [],
  monthlyInstances: [],
  monthlySavingsPlanList: [],
  objectStorages: [],
  archiveStorages: [],
  snapshots: [],
  volumes: [],
  bandwidthByRegions: [],
  privateRegistry: [],
  rancher: [],
  managedKubernetesService: [],
  kubernetesLoadBalancer: [],
  training: [],
  notebooks: [],
  aiDeploy: [],
  aiEndpoints: [],
  coldArchive: [],
  dataProcessing: [],
  dataplatform: [],
  databases: [],
  floatingIP: [],
  publicIP: [],
  gateway: [],
  octaviaLoadBalancer: [],
  totals: {
    total: 0,
    hourly: {
      ...hourlyItems.reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {} as Partial<Record<ConsumptionKey, number>>,
      ),
    },
    monthly: {
      total: 0,
      instance: 0,
      savingsPlan: 0,
    },
  },
});

export const getConsumptionDetails = (
  usage: TCurrentUsage,
): TConsumptionDetail => {
  const apiResourceTypes = [
    ResourceType.REGISTRY,
    ResourceType.LOADBALANCER,
    ResourceType.AI_NOTEBOOK,
    ResourceType.AI_SERVING_ENGINE,
    ResourceType.AI_TRAINING,
    ResourceType.AI_ENDPOINTS,
    ResourceType.DATA_PROCESSING_JOB,
    ResourceType.DATABASES,
    ResourceType.COLD_ARCHIVE,
    ResourceType.FLOATING_IP,
    ResourceType.GATEWAY,
    ResourceType.OCTAVIA_LOADBALANCER,
    ResourceType.AI_APP,
    ResourceType.PUBLIC_IP,
    ResourceType.DATAPLATFORM,
  ];

  const { resources, totals: hourlyTotals } = apiResourceTypes.reduce(
    (acc, type) => {
      const key = getResourceDisplayKey(type);
      const { resources: result, totalPrice } = initResourceUsage(usage, type);
      acc.resources[key] = result;
      acc.totals[key] = totalPrice;
      return acc;
    },
    { resources: {}, totals: {} } as {
      resources: Record<string, TResourceUsage[]>;
      totals: Record<string, number>;
    },
  );

  const {
    monthlyInstanceList,
    monthlyInstanceTotalPrice,
  } = initMonthlyInstanceList(usage.monthlyUsage);

  const {
    monthlySavingsPlanList,
    monthlySavingsPlanTotalPrice,
  } = initMonthlySavingsPlanList(usage.monthlyUsage);

  const {
    hourlyInstanceList,
    hourlyInstanceTotalPrice,
  } = initHourlyInstanceList(usage);

  const { objectStorageList, objectStorageTotalPrice } = initObjectStorageList(
    usage,
  );
  const {
    archiveStorageList,
    archiveStorageTotalPrice,
  } = initArchiveStorageList(usage);
  const { snapshotList, snapshotsTotalPrice } = initSnapshotList(usage);
  const { volumeList, volumesTotalPrice } = initVolumeList(usage);
  const { bandwidthList, bandwidthTotalPrice } = initInstanceBandwidth(usage);
  const {
    list: rancherList,
    totalPrice: rancherTotalPrice,
  } = initConsumptionsList(usage.hourlyUsage.rancher);
  const {
    list: managedKubernetesServiceList,
    totalPrice: managedKubernetesServiceTotalPrice,
  } = initConsumptionsList(usage.hourlyUsage.managedKubernetesService);

  const totals = {
    hourly: {
      ...hourlyTotals,
      [ResourceType.INSTANCE]: hourlyInstanceTotalPrice,
      [ResourceType.OBJECT_STORAGE]: objectStorageTotalPrice,
      [ResourceType.ARCHIVE_STORAGE]: archiveStorageTotalPrice,
      [ResourceType.SNAPSHOT]: snapshotsTotalPrice,
      [ResourceType.VOLUME]: volumesTotalPrice,
      [ResourceType.BANDWIDTH]: bandwidthTotalPrice,
      [ResourceType.RANCHER]: rancherTotalPrice,
      [ResourceType.MANAGED_KUBERNETES_SERVICE]: managedKubernetesServiceTotalPrice,
      [ResourceType.TOTAL]: 0,
    } as Partial<Record<ConsumptionKey, number>>,
    monthly: {
      total: monthlyInstanceTotalPrice + monthlySavingsPlanTotalPrice,
      instance: monthlyInstanceTotalPrice,
      savingsPlan: monthlySavingsPlanTotalPrice,
    },
  };

  totals.hourly[ResourceType.TOTAL] = roundPrice(
    Object.entries(totals.hourly)
      .filter(([key]) => key !== ResourceType.TOTAL)
      .reduce((sum, [, price]) => sum + (price ?? 0), 0),
  );

  const finalTotal = roundPrice(
    (totals.hourly[ResourceType.TOTAL] ?? 0) + totals.monthly.total,
  );

  return {
    hourlyInstances: hourlyInstanceList,
    monthlyInstances: monthlyInstanceList,
    monthlySavingsPlanList,
    objectStorages: objectStorageList,
    archiveStorages: archiveStorageList,
    snapshots: snapshotList,
    rancher: rancherList,
    managedKubernetesService: managedKubernetesServiceList,
    volumes: volumeList,
    bandwidthByRegions: bandwidthList,
    privateRegistry: resources.privateRegistry,
    kubernetesLoadBalancer: resources.kubernetesLoadBalancer,
    training: resources.training,
    aiEndpoints: resources.aiEndpoints,
    aiDeploy: resources.aiDeploy,
    notebooks: resources.notebooks,
    coldArchive: resources.coldArchive,
    dataProcessing: resources.dataProcessing,
    databases: resources.databases,
    floatingIP: resources.floatingIP,
    gateway: resources.gateway,
    octaviaLoadBalancer: resources.octaviaLoadBalancer,
    publicIP: resources.publicIP,
    dataplatform: resources.dataplatform,
    totals: {
      ...totals,
      total: finalTotal,
    },
  };
};

export const useCurrentUsage = (projectId: string) =>
  useQuery({
    queryKey: [projectId, 'current', 'usage'],
    queryFn: async () => {
      const currentUsage = await getCurrentUsage(projectId);
      return currentUsage;
    },
    select: (data) => getConsumptionDetails(data),
    retry: 1,
  });

type ActivateMonthlyBillingProps = {
  projectId: string;
  onError: (error: Error) => void;
  onSuccess: () => void;
};

export const useActivateMonthlyBilling = ({
  projectId,
  onError,
  onSuccess,
}: ActivateMonthlyBillingProps) => {
  const mutation = useMutation({
    mutationFn: async (instanceId: string) =>
      activateMonthlyBilling(projectId, instanceId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [projectId, 'current', 'usage'],
      });

      onSuccess();
    },
  });

  return {
    activateMonthlyBilling: (instanceId: string) => mutation.mutate(instanceId),
    ...mutation,
  };
};
