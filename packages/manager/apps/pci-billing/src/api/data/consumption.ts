import { v6 } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export type TQuantity = {
  unit: string;
  value: number;
};

export type TPeriod = { from: string; to: string };

export enum TConsumptionType {
  dataplatform = 'dataplatform',
  dataprocessing = 'dataprocessing',
  aiendpoints = 'aiendpoints',
  rancher = 'rancher',
  instance = 'instance',
  instanceoption = 'instanceoption',
  snapshot = 'snapshot',
  registry = 'registry',
  loadbalancer = 'loadbalancer',
  aiNotebook = 'ai-notebook',
  aiServingEngine = 'ai-serving-engine',
  aiTraining = 'ai-training',
  aiEndpoints = 'ai-endpoints',
  dataProcessingJob = 'data-processing-job',
  databases = 'databases',
  coldarchive = 'coldarchive',
  floatingip = 'floatingip',
  gateway = 'gateway',
  octaviaLoadbalancer = 'octavia-loadbalancer',
  aiApp = 'ai-app',
  publicip = 'publicip',
}

export type TCurrentUsage = {
  hourlyUsage: {
    rancher: {
      reference: string;
      region: string;
      details: {
        quantity: TQuantity;
        totalPrice: {
          currencyCode: string;
          priceInUcents: number;
          text: string;
          value: number;
        };
      }[];
    }[];
    instance: {
      details: {
        instanceId: string;
        quantity: TQuantity;
        totalPrice: number;
      }[];
      quantity: TQuantity;
      reference: string;
      region: string;
      totalPrice: number;
    }[];
    instanceBandwidth: {
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
    }[];
    snapshot: {
      instance: {
        quantity: TQuantity;
        totalPrice: 0;
      };
      region: string;
      totalPrice: number;
      volume: string | null;
    }[];
    storage: {
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
    }[];
    volume: {
      details: {
        quantity: TQuantity;
        totalPrice: number;
        volumeId: string;
      }[];
      quantity: TQuantity;
      region: string;
      totalPrice: number;
      type: string;
    }[];
    lastUpdate: string;
  };
  lastUpdate: string;
  monthlyUsage: {
    certification: [];
    instance: {
      details: {
        instanceId: string;
        quantity: TQuantity;
        totalPrice: number;
      }[];
      quantity: TQuantity;
      reference: string;
      region: string;
      totalPrice: number;
    }[];
    savingsPlan: {
      flavor: string;
      details: [
        {
          id: string;
          size: string;
          totalPrice: {
            currencyCode: string;
            priceInUcents: number;
            text: string;
            value: number;
          };
        },
      ];
      totalPrice: {
        currencyCode: string;
        priceInUcents: number;
        text: string;
        value: number;
      };
    }[];
  };
  period: TPeriod;
  resourcesUsage: {
    resources: {
      components: {
        quantity: TQuantity;
        name: string;
        totalPrice: number;
      }[];
      region: string;
    }[];
    totalPrice: number;
    type: string;
  }[];
};

export const getCurrentUsage = async (
  projectId: string,
): Promise<TCurrentUsage> => {
  const { data } = await v6.get<TCurrentUsage>(
    `/cloud/project/${projectId}/usage/current`,
  );

  return data;
};

export const activateMonthlyBilling = async (
  projectId: string,
  instanceId: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/instance/${instanceId}/activeMonthlyBilling`,
  );

  return data;
};
