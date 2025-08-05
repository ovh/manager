import { aapi, v6 } from '@ovh-ux/manager-core-api';
import { TStorageObject } from './objects';
import { TReplicationRule } from '../hooks/useStorages';

export type TStorage = {
  archive?: boolean;
  containerType?: 'private' | 'public' | 'static';
  id: string;
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  objectsCount: number;
  containerCount: number;
  usedSpace: number;
  deploymentMode: string;
  offer: string;
  mode: string;
  public?: boolean;
  s3StorageType?: string;
  isHighPerfStorage?: boolean;
  createdAt?: string;
  objects?: TStorageObject[];
  objectsSize?: number;
  virtualHost?: string;
  ownerId?: number;
  state?: string;
};

export type TStoragesAapiResult = {
  resources: TStorage[];
  errors: unknown[];
};

export interface Replication {
  rules: TReplicationRule[];
}

export const getStorages = async (
  projectId: string,
  params = {
    archive: false,
    withObjects: false,
  },
): Promise<TStoragesAapiResult> => {
  const { data } = await aapi.get<TStoragesAapiResult>(
    `/cloud/project/${projectId}/storages`,
    {
      params: {
        ...params,
        serviceName: projectId,
      },
    },
  );

  return data;
};

export const deleteSwiftContainer = (projectId: string, containerId: string) =>
  v6.delete(`/cloud/project/${projectId}/storage/${containerId}`);

export const deleteS3Container = (
  projectId: string,
  region: string,
  s3StorageType: string,
  name: string,
) =>
  v6.delete(
    `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${name}`,
  );

export const getStorage = async (
  projectId: string,
  region: string,
  s3StorageType: string,
  storageId: string,
): Promise<TStorage> => {
  if (s3StorageType) {
    const { data } = await v6.get<TStorage>(
      `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${storageId}`,
    );
    return data;
  }
  const { data } = await v6.get<TStorage>(
    `/cloud/project/${projectId}/storage/${storageId}`,
  );

  return data;
};

interface Versioning {
  status: string;
}

interface Encryption {
  sseAlgorithm: string;
}

interface UpdateStorageParams {
  projectId: string;
  region: string;
  name: string;
  versioning?: Versioning;
  encryption?: Encryption;
  replication?: Replication;
  s3StorageType: string;
}

export const updateStorage = async ({
  projectId,
  region,
  name,
  versioning,
  encryption,
  replication,
  s3StorageType,
}: UpdateStorageParams) => {
  const url =
    s3StorageType === 'storage'
      ? `/cloud/project/${projectId}/region/${region}/storage/${name}`
      : `/cloud/project/${projectId}/region/${region}/storageStandard/${name}`;

  const { data } = await v6.put(url, { versioning, encryption, replication });

  return data;
};

export const createSwiftStorage = async ({
  projectId,
  archive,
  containerName,
  region,
}: {
  projectId: string;
  archive: boolean;
  containerName: string;
  region: string;
}) => {
  const { data } = await v6.post<TStorage>(
    `/cloud/project/${projectId}/storage`,
    {
      archive,
      containerName,
      region,
    },
  );

  return data;
};

export const createS3Storage = async ({
  projectId,
  containerName,
  ownerId,
  region,
  encryption,
  versioning,
  replication,
}: {
  projectId: string;
  containerName: string;
  region: string;
  ownerId: number;
  encryption: string;
  versioning: boolean;
  replication?: Replication;
}) => {
  const { data } = await v6.post<TStorage>(
    `/cloud/project/${projectId}/region/${region}/storage`,
    {
      name: containerName,
      ownerId,
      encryption: {
        sseAlgorithm: encryption,
      },
      replication,
      ...(versioning
        ? {
            versioning: {
              status: versioning ? 'enabled' : 'disabled',
            },
          }
        : {}),
    },
  );

  return data;
};

export type TStorageAccess = {
  endpoints: { region: string; url: string }[];
  token: string;
};

export const getStorageAccess = async ({
  projectId,
}: {
  projectId: string;
}) => {
  const { data } = await v6.post<TStorageAccess>(
    `/cloud/project/${projectId}/storage/access`,
  );

  return data;
};

export const getContainerMetaData = async ({
  projectId,
  containerName,
  region,
}: {
  projectId: string;
  containerName: string;
  region: string;
}) => {
  const access = await getStorageAccess({ projectId });
  const endpoint = access.endpoints?.find(
    (_endpoint) => _endpoint.region === region,
  );
  if (!endpoint) {
    throw new Error(`No endpoint found for region ${region}`);
  }
  const response = await fetch(
    `${endpoint.url}/${encodeURIComponent(containerName)}`,
    {
      method: 'HEAD',
      headers: {
        'X-Auth-Token': access.token,
      },
    },
  );
  const metadataRegex = /^(X-Container|X-Storage)/i;
  const metadata = Object.keys(response.headers)
    .filter((key) => metadataRegex.test(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: response.headers[key],
      }),
      {},
    );
  return { endpoint, token: access.token, metadata };
};

export const setContainerAsStatic = async ({
  projectId,
  containerId,
}: {
  projectId: string;
  containerId: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/storage/${containerId}/static`,
  );

  return data;
};

export const setContainerAsPublic = async ({
  projectId,
  containerName,
  region,
}: {
  projectId: string;
  containerName: string;
  region: string;
}) => {
  const { endpoint, token, metadata } = await getContainerMetaData({
    projectId,
    containerName,
    region,
  });
  const X_CONTAINER_READ = 'x-container-read';
  const X_CONTAINER_READ_PUBLIC_VALUE = '.r:*,.rlistings';
  if (metadata[X_CONTAINER_READ] !== X_CONTAINER_READ_PUBLIC_VALUE) {
    return fetch(`${endpoint.url}/${encodeURIComponent(containerName)}`, {
      method: 'PUT',
      headers: {
        'X-Auth-Token': token,
        [X_CONTAINER_READ]: X_CONTAINER_READ_PUBLIC_VALUE,
      },
    }).then(() => true);
  }
  return true;
};

export const updateStorageType = async ({
  projectId,
  containerId,
  containerType,
}: {
  projectId: string;
  containerId: string;
  containerType: TStorage['containerType'];
}) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/storage/${containerId}`,
    {
      containerType,
    },
  );

  return data;
};
