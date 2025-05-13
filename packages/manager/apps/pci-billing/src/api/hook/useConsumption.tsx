import { useMutation, useQuery } from '@tanstack/react-query';
import { COLD_ARCHIVE_GRID_DATA } from '@/constants';
import queryClient from '@/queryClient';
import {
  activateMonthlyBilling,
  getCurrentUsage,
  TCurrentUsage,
  TQuantity,
} from '../data/consumption';

const roundPrice = (num: number, fractionDigits = 2) =>
  Number(num.toFixed(fractionDigits));

const sumPrices = <T,>(items: T[], key: string) =>
  roundPrice(items?.reduce((sum, item) => sum + item[key], 0));

const initMonthlyInstanceList = (data: TCurrentUsage) => {
  if (!data?.monthlyUsage) {
    return {
      monthlyInstanceList: [],
      monthlyInstanceTotalPrice: 0,
    };
  }

  const monthlyInstanceList = data.monthlyUsage.instance.flatMap((instance) =>
    instance.details.map((detail) => ({
      ...detail,
      totalPrice: roundPrice(detail.totalPrice),
      reference: instance.reference,
      region: instance.region,
    })),
  ) as TInstance[];

  const monthlyInstanceTotalPrice = roundPrice(
    data.monthlyUsage.instance.reduce(
      (sum, instance) => sum + roundPrice(instance.totalPrice),
      0,
    ),
  );

  return {
    monthlyInstanceList,
    monthlyInstanceTotalPrice,
  };
};

const initHourlyInstanceList = (data: TCurrentUsage) => {
  if (!data?.hourlyUsage) {
    return { hourlyInstanceList: [], hourlyInstanceTotalPrice: 0 };
  }

  const hourlyInstanceList = data.hourlyUsage.instance.flatMap((instance) =>
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
  if (!data?.hourlyUsage) {
    return {
      objectStorageList: [],
      objectStorageTotalPrice: 0,
    };
  }

  const objectStorageList = data.hourlyUsage.storage?.filter(
    (storage) => storage.type !== 'pca',
  );

  const objectStorageTotalPrice = roundPrice(
    objectStorageList.reduce(
      (sum, storage) => sum + roundPrice(storage.totalPrice),
      0,
    ),
  );

  return {
    objectStorageList,
    objectStorageTotalPrice,
  };
};

const initArchiveStorageList = (data: TCurrentUsage) => {
  if (!data?.hourlyUsage) {
    return {
      archiveStorageList: [],
      archiveStorageTotalPrice: 0,
    };
  }

  const archiveStorageList = data.hourlyUsage.storage?.filter(
    (storage) => storage.type === 'pca',
  );

  const archiveStorageTotalPrice = roundPrice(
    archiveStorageList.reduce(
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
  if (!data?.hourlyUsage) {
    return {
      snapshotList: [],
      snapshotsTotalPrice: 0,
    };
  }

  const snapshotList = data.hourlyUsage.snapshot.map((snapshot) => ({
    ...snapshot,
    totalPrice: roundPrice(snapshot.totalPrice),
  }));

  const snapshotsTotalPrice = roundPrice(
    data.hourlyUsage.snapshot.reduce(
      (sum, snapshot) => sum + roundPrice(snapshot.totalPrice),
      0,
    ),
  );

  return {
    snapshotList,
    snapshotsTotalPrice,
  };
};

const initVolumeList = (data: TCurrentUsage) => {
  if (!data?.hourlyUsage) {
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
  if (!data?.hourlyUsage) {
    return {
      bandwidthList: [],
      bandwidthTotalPrice: 0,
    };
  }

  const bandwidthList = data.hourlyUsage.instanceBandwidth.map(
    (bandwidthByRegion) => ({
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
    }),
  );

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
      return sum + object?.totalPrice;
    }
    return sum;
  }, 0);

const sumColdArchiveBillingQuantitiesByName = (
  coldArchives: TConsumptionDetail['coldArchive'],
  name: string,
) =>
  coldArchives.reduce((sum, object) => {
    if (object.name === name) {
      return sum + object?.quantity?.value;
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

const initResourceUsage = (data: TCurrentUsage, resourceType: string) => {
  let resources = (data?.resourcesUsage || [])
    .filter((resource) => resource.type === resourceType)
    .flatMap((resource) => resource.resources || [])
    .flatMap((resourceDetail) =>
      (resourceDetail.components || []).map((resourceComponent) => ({
        ...resourceComponent,
        region: resourceDetail.region,
      })),
    );

  if (resourceType === 'coldarchive') {
    resources = reduceColdArchiveBillingInfo(resources);
  }

  const totalPrice = sumPrices(resources, 'totalPrice');

  return {
    resources: resources || [],
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
  objectStorages: TStorage[];
  archiveStorages: TStorage[];
  snapshots: TSnapshot[];
  volumes: TVolume[];
  bandwidthByRegions: TInstanceBandWith[];
  privateRegistry: TResourceUsage[];
  kubernetesLoadBalancer: TResourceUsage[];
  training: TResourceUsage[];
  notebooks: TResourceUsage[];
  aiDeploy: TResourceUsage[];
  coldArchive: TResourceUsage[];
  dataProcessing: TResourceUsage[];
  databases: TResourceUsage[];
  floatingIP: TResourceUsage[];
  publicIP: TResourceUsage[];
  gateway: TResourceUsage[];
  octaviaLoadBalancer: TResourceUsage[];
  totals: {
    total: number;
    hourly: {
      total: number;
      instance: number;
      objectStorage: number;
      archiveStorage: number;
      snapshot: number;
      volume: number;
      bandwidth: number;
      privateRegistry: number;
      kubernetesLoadBalancer: number;
      notebooks: number;
      coldArchive: number;
      serving: number;
      training: number;
      aiDeploy: number;
      dataProcessing: number;
      databases: number;
      floatingIP: number;
      gateway: number;
      octaviaLoadBalancer: number;
      publicIP: number;
    };
    monthly: {
      total: number;
      instance: number;
    };
  };
};

export const initializeTConsumptionDetail = (): TConsumptionDetail => ({
  hourlyInstances: [],
  monthlyInstances: [],
  objectStorages: [],
  archiveStorages: [],
  snapshots: [],
  volumes: [],
  bandwidthByRegions: [],
  privateRegistry: [],
  kubernetesLoadBalancer: [],
  training: [],
  notebooks: [],
  aiDeploy: [],
  coldArchive: [],
  dataProcessing: [],
  databases: [],
  floatingIP: [],
  publicIP: [],
  gateway: [],
  octaviaLoadBalancer: [],
  totals: {
    total: 0,
    hourly: {
      total: 0,
      instance: 0,
      objectStorage: 0,
      archiveStorage: 0,
      snapshot: 0,
      volume: 0,
      bandwidth: 0,
      privateRegistry: 0,
      kubernetesLoadBalancer: 0,
      notebooks: 0,
      coldArchive: 0,
      serving: 0,
      training: 0,
      aiDeploy: 0,
      dataProcessing: 0,
      databases: 0,
      floatingIP: 0,
      gateway: 0,
      octaviaLoadBalancer: 0,
      publicIP: 0,
    },
    monthly: {
      total: 0,
      instance: 0,
    },
  },
});

export const getConsumptionDetails = (usage: TCurrentUsage) => {
  const resourceMap = [
    { type: 'registry', key: 'privateRegistry' },
    { type: 'loadbalancer', key: 'kubernetesLoadBalancer' },
    { type: 'ai-notebook', key: 'notebooks' },
    { type: 'ai-serving-engine', key: 'serving' },
    { type: 'ai-training', key: 'training' },
    { type: 'data-processing-job', key: 'dataProcessing' },
    { type: 'databases', key: 'databases' },
    { type: 'coldarchive', key: 'coldArchive' },
    { type: 'floatingip', key: 'floatingIP' },
    { type: 'gateway', key: 'gateway' },
    { type: 'octavia-loadbalancer', key: 'octaviaLoadBalancer' },
    { type: 'ai-app', key: 'aiDeploy' },
    { type: 'publicip', key: 'publicIP' },
  ];

  const { resources, totals: hourlyTotals } = resourceMap.reduce(
    (acc, { type, key }) => {
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
  } = initMonthlyInstanceList(usage);

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

  const totals = {
    hourly: {
      total: 0,
      ...hourlyTotals,
      instance: hourlyInstanceTotalPrice,
      objectStorage: objectStorageTotalPrice,
      archiveStorage: archiveStorageTotalPrice,
      snapshot: snapshotsTotalPrice,
      volume: volumesTotalPrice,
      bandwidth: bandwidthTotalPrice,
    },
    monthly: {
      total: monthlyInstanceTotalPrice,
      instance: monthlyInstanceTotalPrice,
    },
  };

  totals.hourly.total = roundPrice(
    Object.values(totals.hourly).reduce((sum, price) => sum + price, 0),
  );

  const finalTotal = roundPrice(totals.hourly.total + totals.monthly.total);

  return {
    hourlyInstances: hourlyInstanceList,
    monthlyInstances: monthlyInstanceList,
    objectStorages: objectStorageList,
    archiveStorages: archiveStorageList,
    snapshots: snapshotList,
    volumes: volumeList,
    bandwidthByRegions: bandwidthList,
    ...resources,
    totals: {
      ...totals,
      total: finalTotal,
    },
  } as TConsumptionDetail;
};

export const useGeTCurrentUsage = (projectId: string) =>
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
