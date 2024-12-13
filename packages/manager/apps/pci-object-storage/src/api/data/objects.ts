import { v6 } from '@ovh-ux/manager-core-api';
import { addMonths } from 'date-fns';
import { OPENIO_DEFAULT_REGION, OPENIO_PRESIGN_EXPIRE } from '@/constants';

export type TAccess = {
  token: string;
  endpoints: { region: string; url: string }[];
};
export const getAccessToken = async (projectId: string): Promise<TAccess> => {
  const { data } = await v6.post<TAccess>(
    `/cloud/project/${projectId}/storage/access`,
  );
  return data;
};

export const deleteS3Object = async (
  projectId: string,
  containerId: string,
  objectName: string,
  containerRegion: string,
  s3StorageType: string,
) => {
  const region = containerRegion || OPENIO_DEFAULT_REGION;
  const key = encodeURIComponent(objectName).replace(/\./g, '%2E');
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${containerId}/object/${key}`,
  );
  return data;
};

export const deleteObject = async (
  projectId: string,
  storageName: string,
  objectName: string,
  token: string,
  region: string,
): Promise<void> => {
  const response = await fetch(
    `https://storage.${region}.cloud.ovh.net/v1/AUTH_${projectId}/${storageName}/${encodeURIComponent(
      objectName,
    )}`,
    {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': token,
      },
    },
  );
  return response.json();
};

export const addUser = async (
  projectId: string,
  region: string,
  objectName: string,
  storageId: string,
  userId: string,
  role: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${storageId}/policy/${userId}`,
    {
      roleName: role,
      objectKey: objectName,
    },
  );
  return data;
};

export const downloadStandardS3Object = async (
  projectId: string,
  regionName: string,
  storageId: string,
  object,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${regionName}/${object.s3StorageType}/${storageId}/presign`,
    {
      expire: OPENIO_PRESIGN_EXPIRE,
      method: 'GET',
      object: object.key,
    },
  );
  return data;
};

export const downloadObject = async (
  projectId: string,
  storageId: string,
  object,
) => {
  const expirationDate = addMonths(new Date(), 1).toISOString();

  const { data } = await v6.post(
    `/cloud/project/${projectId}/storage/${storageId}/publicUrl`,
    {
      expirationDate,
      objectName: object?.name,
    },
  );

  return data;
};
