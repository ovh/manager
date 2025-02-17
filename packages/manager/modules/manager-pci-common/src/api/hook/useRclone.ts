import { ApiError } from '@ovh-ux/manager-core-api';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import {
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  RCLONE_SERVICE_TYPE,
} from '../../components/rclone-download/constants';
import { downloadRCloneConfig } from '../data/rclone';

type DownloadRCloneConfigProps = {
  projectId: string;
  userId: string;
  onError: (cause: ApiError) => void;
  onSuccess: (content: string) => void;
};

const readFile = (data: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(data);
  });

export const useDownloadRCloneConfig = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: DownloadRCloneConfigProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async ({
    region,
    fileType,
  }: {
    region: string;
    fileType: string;
  }) => {
    try {
      setIsLoading(true);

      const { content } = await downloadRCloneConfig({
        projectId,
        userId,
        region,
        service:
          RCLONE_SERVICE_TYPE[fileType.toUpperCase()] || RCLONE_SERVICE_TYPE.S3,
      });

      const data = new Blob([content], { type: DOWNLOAD_RCLONE_FILETYPE });
      saveAs(data, DOWNLOAD_RCLONE_FILENAME);
      const file = await readFile(data);
      window.open(file as string, '_top');
      onSuccess(file as string);
    } catch (error) {
      onError(error as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    download,
  };
};
