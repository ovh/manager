import { v6 } from '@ovh-ux/manager-core-api';
import axios from 'axios';
import {
  ITEMS_PER_PAGE,
  OPENIO_DEFAULT_REGION,
  OPENIO_PRESIGN_EXPIRE,
  X_AMZ_STORAGE_CLASS,
  X_AUTH_TOKEN,
} from '@/constants';
import { getStorageAccess, TStorage, TStorageAccess } from './storages';
import { TObject } from './container';

interface GetObjectVersionsParams {
  projectId: string;
  region: string;
  name: string;
  key: string;
  versionIdMarker: string | null;
}
export type TStorageObject = {
  [key: string]: any;
  name: string;
};

type S3ObjectDeleteParams = {
  projectId: string;
  containerId: string;
  objectName: string;
  containerRegion: string;
  s3StorageType: string;
  versionId?: string;
};

export const deleteS3Object = async ({
  projectId,
  containerId,
  objectName,
  containerRegion,
  s3StorageType,
  versionId,
}: S3ObjectDeleteParams) => {
  const region = containerRegion || OPENIO_DEFAULT_REGION;
  const key = encodeURIComponent(objectName).replace(/\./g, '%2E');

  const baseUrl = `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${containerId}/object/${key}`;
  const versionParam = versionId ? `/version/${versionId}` : '';
  const totalUrl = baseUrl + versionParam;

  return v6.delete(totalUrl);
};

export const deleteSwiftObject = async ({
  storageName,
  objectName,
  token,
  url,
}: {
  storageName: string;
  objectName: string;
  token: string;
  url: string;
}): Promise<Response> => {
  return axios.delete(
    `${url}/${storageName}/${encodeURIComponent(objectName)}`,
    {
      method: 'DELETE',
      headers: {
        [X_AUTH_TOKEN]: token,
      },
    },
  );
};

export const addUser = async ({
  projectId,
  region,
  storageId,
  userId,
  role,
  objectName,
}: {
  projectId: string;
  region: string;
  storageId: string;
  userId: number;
  role: string;
  objectName?: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${storageId}/policy/${userId}`,
    {
      roleName: role,
      objectKey: objectName,
    },
  );
  return data;
};

const getFilePath = (filePrefix: string, file: File): string => {
  if (!filePrefix) return file.name;

  let prefix = filePrefix;

  if (filePrefix.startsWith('/')) {
    prefix = prefix.substring(1);
  }

  if (!filePrefix.endsWith('/')) {
    prefix = `${prefix}/`;
  }

  return `${prefix}${file.name}`;
};

const addHighPerfObject = (
  serviceName: string,
  regionName: string,
  containerName: string,
  prefix: string,
  file: File,
  s3StorageType: string,
  storageClass: string,
) => {
  const config = {
    headers: {
      'Content-Type': file.type,
    },
    data: file,
  };

  return v6
    .post(
      `/cloud/project/${serviceName}/region/${regionName}/${s3StorageType}/${containerName}/presign`,
      {
        expire: OPENIO_PRESIGN_EXPIRE,
        method: 'PUT',
        object: getFilePath(prefix, file),
        storageClass,
      },
    )
    .then((res) => {
      config.headers[X_AMZ_STORAGE_CLASS] =
        res?.data?.signedHeaders[X_AMZ_STORAGE_CLASS];
      return res.data;
    })
    .then(({ url }) => {
      return v6.put(url, config.data, {
        headers: {
          ...config.headers,
        },
      });
    });
};

export const addHighPerfObjects = (
  projectId: string,
  regionName: string,
  containerName: string,
  prefix: string,
  files: File[],
  s3StorageType: string,
  storageClass: string,
) =>
  Promise.all(
    files.map((file) =>
      addHighPerfObject(
        projectId,
        regionName,
        containerName,
        prefix,
        file,
        s3StorageType,
        storageClass,
      ),
    ),
  );

const getContainerUrl = async (
  projectId: string,
  container: TStorage,
  filePath?: string,
): Promise<string> => {
  const { endpoints } = await getStorageAccess({ projectId });

  const mappedEndpoints = endpoints.reduce(
    (result, endpoint) => ({
      ...result,
      [endpoint.region.toLowerCase()]: endpoint.url,
    }),
    {},
  );

  const region = (container?.region || OPENIO_DEFAULT_REGION).toLowerCase();
  const baseUrl = `${mappedEndpoints[region]}/${encodeURIComponent(
    container?.name,
  )}`;

  return filePath ? `${baseUrl}/${encodeURIComponent(filePath)}` : baseUrl;
};

const upload = (url: string, file: File, accessToken: TStorageAccess) => {
  return axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
      [X_AUTH_TOKEN]: accessToken.token,
    },
  });
};

const addObject = async (
  projectId: string,
  container: TStorage,
  filePrefix: string,
  file: File,
) => {
  const [url, accessToken] = await Promise.all([
    getContainerUrl(projectId, container, getFilePath(filePrefix, file)),
    getStorageAccess({ projectId }),
  ]);

  return upload(url, file, accessToken);
};

export const addObjects = (
  projectId: string,
  container: TStorage,
  filePrefix: string,
  files: File[],
) =>
  Promise.all(
    files.map((file: File) =>
      addObject(projectId, container, filePrefix, file),
    ),
  );

export const getObjectVersions = async ({
  projectId,
  region,
  name,
  key,
  versionIdMarker,
}: GetObjectVersionsParams): Promise<{
  objects: TObject[];
}> => {
  const url = `/cloud/project/${projectId}/region/${region}/storage/${name}/object/${key}/version`;

  const { data } = await v6.get<TObject[]>(url, {
    params: {
      limit: ITEMS_PER_PAGE + 1,
      versionIdMarker,
    },
  });

  return {
    objects: data,
  };
};
