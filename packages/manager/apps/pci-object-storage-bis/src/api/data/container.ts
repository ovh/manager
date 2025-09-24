import { v6 } from '@ovh-ux/manager-core-api';
import { ITEMS_PER_PAGE, ReplicationStorageClass } from '@/constants';

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
  versionId?: string;
  isLatest?: boolean;
  isDeleteMarker?: boolean;
};

interface GetContainerObjectsParams {
  projectId: string;
  region: string;
  name: string;
  withVersions: boolean;
  keyMarker?: string;
  versionIdMarker?: string;
  prefix?: string;
}
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
  objectLock: {
    rule?: {
      mode: string;
      period: string;
    };
    status: string;
  };
  virtualHost: string;
  staticUrl: string;
  replication: {
    rules: {
      id: string;
      status: 'enabled' | 'disabled';
      priority: number;
      destination: {
        name: string;
        region: string;
        storageClass: ReplicationStorageClass;
      };
      deleteMarkerReplication: 'enabled' | 'disabled';
      filter?: { prefix: string; tags: { [key: string]: string } };
    }[];
  };
  deploymentMode?: string;
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

export const getContainerObjects = async ({
  projectId,
  region,
  name,
  withVersions,
  keyMarker,
  versionIdMarker,
  prefix,
}: GetContainerObjectsParams): Promise<{
  objects: TObject[];
}> => {
  const url = `/cloud/project/${projectId}/region/${region}/storage/${name}/object`;

  const { data } = await v6.get<TObject[]>(url, {
    params: {
      withVersions,
      keyMarker,
      limit: ITEMS_PER_PAGE + 1,
      versionIdMarker,
      prefix,
    },
  });

  return {
    objects: data,
  };
};
