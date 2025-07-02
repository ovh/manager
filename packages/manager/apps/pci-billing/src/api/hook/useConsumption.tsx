import { useMutation, useQuery } from '@tanstack/react-query';
import { COLD_ARCHIVE_GRID_DATA } from '@/constants';
import queryClient from '@/queryClient';
import {
  activateMonthlyBilling,
  getCurrentUsage,
  TConsumptionType,
  TCurrentUsage,
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

const initRancherList = (
  data: TCurrentUsage,
): {
  rancherList: TResourceUsage[];
  rancherTotalPrice: number;
} => {
  if (!data.hourlyUsage.rancher.length) {
    return {
      rancherList: [],
      rancherTotalPrice: 0,
    };
  }

  const rancherList = data.hourlyUsage.rancher.flatMap((rancher) =>
    rancher.details.map((r) => ({
      ...r,
      totalPrice: roundPrice(r.totalPrice.value),
      name: rancher.reference,
      region: rancher.region,
    })),
  );

  const rancherTotalPrice = roundPrice(
    data.hourlyUsage.rancher
      .flatMap((rancher) => rancher.details)
      .reduce((sum, rancher) => sum + roundPrice(rancher.totalPrice.value), 0),
  );

  return {
    rancherList,
    rancherTotalPrice,
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

const initResourceUsage = (data: TCurrentUsage, resourceType: string) => {
  let resources = data.resourcesUsage
    .filter((resource) => resource.type === resourceType)
    .flatMap((resource) => resource.resources)
    .flatMap((resourceDetail) =>
      resourceDetail.components.map((resourceComponent) => ({
        ...resourceComponent,
        region: resourceDetail.region,
      })),
    );

  if (resourceType === 'coldarchive') {
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
    hourly: {
      total: number;
      instance: number;
      objectStorage: number;
      archiveStorage: number;
      snapshot: number;
      volume: number;
      rancher: number;
      dataplatform: number;
      bandwidth: number;
      privateRegistry: number;
      kubernetesLoadBalancer: number;
      notebooks: number;
      coldArchive: number;
      serving: number;
      training: number;
      aiEndpoints: number;
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
      savingsPlan: number;
    };
  };
};

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
      total: 0,
      instance: 0,
      objectStorage: 0,
      archiveStorage: 0,
      snapshot: 0,
      volume: 0,
      rancher: 0,
      bandwidth: 0,
      privateRegistry: 0,
      kubernetesLoadBalancer: 0,
      notebooks: 0,
      coldArchive: 0,
      serving: 0,
      training: 0,
      aiDeploy: 0,
      aiEndpoints: 0,
      dataProcessing: 0,
      databases: 0,
      floatingIP: 0,
      gateway: 0,
      octaviaLoadBalancer: 0,
      publicIP: 0,
      dataplatform: 0,
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
  const resourceMap = [
    { type: TConsumptionType.registry, key: 'privateRegistry' },
    { type: TConsumptionType.loadbalancer, key: 'kubernetesLoadBalancer' },
    { type: TConsumptionType.aiNotebook, key: 'notebooks' },
    { type: TConsumptionType.aiServingEngine, key: 'serving' },
    { type: TConsumptionType.aiTraining, key: 'training' },
    { type: TConsumptionType.aiEndpoints, key: 'aiEndpoints' },
    { type: TConsumptionType.dataProcessingJob, key: 'dataProcessing' },
    { type: TConsumptionType.databases, key: 'databases' },
    { type: TConsumptionType.coldarchive, key: 'coldArchive' },
    { type: TConsumptionType.floatingip, key: 'floatingIP' },
    { type: TConsumptionType.gateway, key: 'gateway' },
    { type: TConsumptionType.octaviaLoadbalancer, key: 'octaviaLoadBalancer' },
    { type: TConsumptionType.aiApp, key: 'aiDeploy' },
    { type: TConsumptionType.publicip, key: 'publicIP' },
    { type: TConsumptionType.dataplatform, key: 'dataplatform' },
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
  const { rancherList, rancherTotalPrice } = initRancherList(usage);

  const totals = {
    hourly: {
      total: 0,
      ...hourlyTotals,
      instance: hourlyInstanceTotalPrice,
      objectStorage: objectStorageTotalPrice,
      archiveStorage: archiveStorageTotalPrice,
      snapshot: snapshotsTotalPrice,
      volume: volumesTotalPrice,
      rancher: rancherTotalPrice,
      bandwidth: bandwidthTotalPrice,
      privateRegistry: hourlyTotals.privateRegistry,
      kubernetesLoadBalancer: hourlyTotals.kubernetesLoadBalancer,
      notebooks: hourlyTotals.notebooks,
      coldArchive: hourlyTotals.coldArchive,
      serving: hourlyTotals.serving,
      training: hourlyTotals.training,
      aiDeploy: hourlyTotals.aiDeploy,
      aiEndpoints: hourlyTotals.aiEndpoints,
      dataProcessing: hourlyTotals.dataProcessing,
      databases: hourlyTotals.databases,
      floatingIP: hourlyTotals.floatingIP,
      gateway: hourlyTotals.gateway,
      octaviaLoadBalancer: hourlyTotals.octaviaLoadBalancer,
      publicIP: hourlyTotals.publicIP,
      dataplatform: hourlyTotals.dataplatform,
    },
    monthly: {
      total: monthlyInstanceTotalPrice + monthlySavingsPlanTotalPrice,
      instance: monthlyInstanceTotalPrice,
      savingsPlan: monthlySavingsPlanTotalPrice,
    },
  };

  totals.hourly.total = roundPrice(
    Object.values(totals.hourly).reduce((sum, price) => sum + price, 0),
  );

  const finalTotal = roundPrice(totals.hourly.total + totals.monthly.total);

  return {
    hourlyInstances: hourlyInstanceList,
    monthlyInstances: monthlyInstanceList,
    monthlySavingsPlanList,
    objectStorages: objectStorageList,
    archiveStorages: archiveStorageList,
    snapshots: snapshotList,
    rancher: rancherList,
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
    totals: {
      ...totals,
      total: finalTotal,
    },
  };
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
