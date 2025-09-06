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

type TPeriod = { from: string; to: string };

type DetailedTotalPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

type ConsumptionItemDetail = {
  quantity: TQuantity;
  totalPrice: number;
};

type ConsumptionItemDetailPrice = {
  quantity: TQuantity;
  totalPrice: DetailedTotalPrice;
};

export type THourlyConsumption = {
  reference: string;
  region: string;
  details: ConsumptionItemDetailPrice[];
};

export type THourlyCurrentUsage = {
  rancher: THourlyConsumption[];
  quantum: { notebook: THourlyConsumption[] };
  instance: ({
    details: ({
      instanceId: string;
    } & ConsumptionItemDetail)[];
    reference: string;
    region: string;
  } & ConsumptionItemDetail)[];
  instanceBandwidth: {
    incomingBandwidth: ConsumptionItemDetail;
    outgoingBandwidth: ConsumptionItemDetail;
    region: string;
    totalPrice: number;
  }[];
  managedKubernetesService: THourlyConsumption[];
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
    incomingBandwidth: ConsumptionItemDetail;
    incomingInternalBandwidth: ConsumptionItemDetail;
    outgoingBandwidth: ConsumptionItemDetail;
    outgoingInternalBandwidth: ConsumptionItemDetail;
    region: string;
    stored: ConsumptionItemDetail;
    totalPrice: number;
    type: string;
  }[];
  volume: ({
    details: ({
      volumeId: string;
    } & ConsumptionItemDetail)[];
    region: string;
    type: string;
  } & ConsumptionItemDetail)[];
  lastUpdate: string;
};

export type TCurrentUsage = {
  hourlyUsage: THourlyCurrentUsage;
  lastUpdate: string;
  monthlyUsage: {
    certification: [];
    instance: ({
      details: ({
        instanceId: string;
      } & ConsumptionItemDetail)[];
      reference: string;
      region: string;
    } & ConsumptionItemDetail)[];
    savingsPlan: {
      flavor: string;
      details: [
        {
          id: string;
          size: string;
          totalPrice: DetailedTotalPrice;
        },
      ];
      totalPrice: DetailedTotalPrice;
    }[];
  };
  period: TPeriod;
  resourcesUsage: {
    resources: {
      components: ({
        name: string;
      } & ConsumptionItemDetail)[];
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
