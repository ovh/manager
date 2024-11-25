import { v6 } from '@ovh-ux/manager-core-api';

export const HOURLY_PRODUCTS = [
  'instance',
  'snapshot',
  'objectStorage',
  'archiveStorage',
  'volume',
  'bandwidth',
  'privateRegistry',
  'kubernetesLoadBalancer',
  'notebooks',
  'serving',
  'training',
  'aiDeploy',
  'dataProcessing',
  'databases',
  'floatingIP',
  'gateway',
  'octaviaLoadBalancer',
  'publicIP',
] as const;
export type THourlyProduct = typeof HOURLY_PRODUCTS[number];

const RESOURCE_USAGES = [
  'databases',
  'floatingip',
  'publicip',
  'gateway',
  'registry',
  'octavia-loadbalancer',
  'ai-app',
  'ai-training',
];
export type TResourceUsage = typeof RESOURCE_USAGES[number];

type TWithTotalPrice = {
  totalPrice: number;
};

export type TUsage = {
  hourlyUsage: {
    instance: ({ reference: string } & TWithTotalPrice)[];
    instanceBandwidth: ({
      outgoingBandwidth: TWithTotalPrice;
    } & TWithTotalPrice)[];
    snapshot: TWithTotalPrice[];
    volume: TWithTotalPrice[];
    storage: ({ type: string } & TWithTotalPrice)[];
  };
  monthlyUsage: {
    instance: TWithTotalPrice[];
  };
  resourcesUsage: {
    type: TResourceUsage;
    resources: { components: TWithTotalPrice[] }[];
  }[];
};

export type TUsageKind = 'current' | 'forecast';

export const getUsage = async (
  projectId: string,
  kind: TUsageKind,
): Promise<TUsage> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/usage/${kind}`);
  return data;
};
