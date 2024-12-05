import { aapi, v6 } from '@ovh-ux/manager-core-api';

export type TStorage = {
  archive?: boolean;
  containerType?: 'private' | 'public' | 'static';
  id: string;
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  usedSpace: number;
  offer?: string;
  mode?: string;
  public?: boolean;
  s3StorageType?: string;
  isHighPerfStorage?: boolean;
  createdAt?: string;
  objects?: unknown[];
  objectsSize?: number;
  virtualHost?: string;
  ownerId?: string;
  deploymentMode?: string;
  state?: string;
};

export type TStoragesAapiResult = {
  resources: TStorage[];
  errors: unknown[];
};

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

export const deleteContainer = async (
  projectId: string,
  containerId: string,
) => {
  await v6.delete(`/cloud/project/${projectId}/storage/${containerId}`);
};

export const deleteS3Container = async (
  projectId: string,
  region: string,
  s3StorageType: string,
  name: string,
) => {
  await v6.delete(
    `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${name}`,
  );
};

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

export const updateStorage = async ({
  projectId,
  region,
  name,
  versioning,
  s3StorageType,
}: {
  projectId: string;
  region: string;
  name: string;
  versioning: { status: string };
  s3StorageType: string;
}) => {
  const url =
    s3StorageType === 'storage'
      ? `/cloud/project/${projectId}/region/${region}/storage/${name}`
      : `/cloud/project/${projectId}/region/${region}/storageStandard/${name}`;

  const { data } = await v6.put(url, { versioning });

  return data;
};
