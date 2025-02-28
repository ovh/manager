import { v6 } from '@ovh-ux/manager-core-api';

export type TObject = {
  key: string;
  name: string;
  etag: string;
  size: number;
  contentType: string;
  lastModified: string;
  storageClass: string;
  s3StorageType: string;
  retrievalState: string;
  retrievalDate: string;
};
export type TServerContainer = {
  createdAt: string;
  encryption: {
    sseAlgorithm: string;
  };
  id: string;
  name: string;
  objects: TObject[];
  objectsCount: number;
  objectsSize: number;
  ownerId: number;
  region: string;
  s3StorageType: unknown;
  storedBytes: number;
  storedObjects: number;
  versioning: {
    status: string;
  };
  virtualHost: string;
  staticUrl: string;
  replication: {
    rules: {
      status: string;
    }[];
  };
};

export const getServerContainer = async (
  projectId: string,
  region: string,
  name: string,
  id: string,
): Promise<TServerContainer> => {
  const url = id
    ? `/cloud/project/${projectId}/storage/${id}`
    : `/cloud/project/${projectId}/region/${region}/storage/${name}`;

  const { data } = await v6.get<TServerContainer>(url);
  return data;
};
