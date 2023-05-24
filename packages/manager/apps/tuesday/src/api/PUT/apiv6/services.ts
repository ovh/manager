import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';

type Storage = unknown;
type Partition = unknown;
type Service = unknown;

export type PutDedicatedNashaServiceParams = {
  /** New object properties */
  storage?: Storage;
  /** The internal name of your storage */
  serviceName?: string;
};

export const putDedicatedNashaServiceQueryKey = (
  params: PutDedicatedNashaServiceParams,
) => [`/dedicated/nasha/${params.serviceName}`];

/**
 * Storage nas HA : Alter this object properties
 */
export const putDedicatedNashaService = async (
  params: PutDedicatedNashaServiceParams,
): Promise<undefined> => {
  const fetchData = async () => {
    const response = await apiClient.v6.put(
      `/dedicated/nasha/${params.serviceName}`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    putDedicatedNashaServiceQueryKey(params),
    fetchData,
  );
};

export type PutDedicatedNashaServicePartitionPartitionNameParams = {
  /** New object properties */
  partition?: Partition;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const putDedicatedNashaServicePartitionPartitionNameQueryKey = (
  params: PutDedicatedNashaServicePartitionPartitionNameParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
];

/**
 * Storage zpool partition : Alter this object properties
 */
export const putDedicatedNashaServicePartitionPartitionName = async (
  params: PutDedicatedNashaServicePartitionPartitionNameParams,
): Promise<undefined> => {
  const fetchData = async () => {
    const response = await apiClient.v6.put(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    putDedicatedNashaServicePartitionPartitionNameQueryKey(params),
    fetchData,
  );
};

export type PutDedicatedNashaServiceServiceInfosParams = {
  /** New object properties */
  service?: Service;
  /** The internal name of your storage */
  serviceName?: string;
};

export const putDedicatedNashaServiceServiceInfosQueryKey = (
  params: PutDedicatedNashaServiceServiceInfosParams,
) => [`/dedicated/nasha/${params.serviceName}/serviceInfos`];

/**
 * Details about a Service : Alter this object properties
 */
export const putDedicatedNashaServiceServiceInfos = async (
  params: PutDedicatedNashaServiceServiceInfosParams,
): Promise<undefined> => {
  const fetchData = async () => {
    const response = await apiClient.v6.put(
      `/dedicated/nasha/${params.serviceName}/serviceInfos`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    putDedicatedNashaServiceServiceInfosQueryKey(params),
    fetchData,
  );
};
