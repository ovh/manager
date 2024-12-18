import { v6 } from '@ovh-ux/manager-core-api';
import { OPENIO_DEFAULT_REGION } from '@/constants';

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
