import { v6 } from '@ovh-ux/manager-core-api';
import { addWeeks } from 'date-fns';
import { OPENIO_PRESIGN_EXPIRE } from '@/constants';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';
import { TObject } from '@/api/data/container';

export const downloadObject = async (
  object: TObject,
  container: TContainer,
  projectId: string,
) => {
  let downloadUrl;

  if (container.s3StorageType) {
    const presignUrl = `/cloud/project/${projectId}/region/${container.region}/${container.s3StorageType}/${container.name}/presign`;
    const presignOptions = {
      expire: OPENIO_PRESIGN_EXPIRE,
      method: 'GET',
      object: object.key,
      ...(object.versionId && { versionId: object.versionId }),
    };

    const { data: presignData } = await v6.post<{ url: string }>(
      presignUrl,
      presignOptions,
    );
    downloadUrl = presignData.url;
  } else {
    const expirationDate = addWeeks(new Date(), 1).toISOString();
    const publicUrl = `/cloud/project/${projectId}/storage/${container.id}/publicUrl`;
    const publicOptions = {
      expirationDate,
      objectName: object.name,
    };

    const { data: publicData } = await v6.post<{ getURL: string }>(
      publicUrl,
      publicOptions,
    );
    downloadUrl = publicData.getURL;
  }

  const response = await fetch(downloadUrl);
  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = object.key || object.name;
  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(blobUrl);
  document.body.removeChild(link);
};
