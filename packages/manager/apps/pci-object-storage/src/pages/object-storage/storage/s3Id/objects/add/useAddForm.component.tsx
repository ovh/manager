import { useToast } from '@datatr-ux/uxlib';
import { useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { useAddS3Object } from '@/data/hooks/s3-storage/useAddS3Object.hook';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';

export const useAddS3Form = ({ onUploadEnd }: { onUploadEnd: () => void }) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const toast = useToast();
  const { projectId } = useParams();
  const { s3 } = useS3Data();

  const targetCountRef = useRef(0);
  const uploadedCountRef = useRef(0);
  const isUploading = useRef(false);

  // increment current batch status and close on finished
  const handleDownloadState = () => {
    uploadedCountRef.current += 1;
    if (uploadedCountRef.current === targetCountRef.current) {
      isUploading.current = false;
      onUploadEnd();
      uploadedCountRef.current = 0;
    }
  };

  const { addS3Object } = useAddS3Object({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onAddSuccess: () => {
      handleDownloadState();
      toast.toast({
        title: t('objectToastSuccessTitle'),
        description: t('addObjectToastSuccessDescription'),
      });
    },
  });

  const { getPresignUrlS3 } = useGetPresignUrlS3({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (presignUrl, file) => {
      addS3Object({
        file,
        method: presignUrl.method,
        signedHeaders: presignUrl.signedHeaders,
        url: presignUrl.url,
      });
    },
  });

  const onSubmit: SubmitHandler<{
    prefix?: string;
    storageClass?: storages.StorageClassEnum;
    files?: File[];
  }> = (formValues) => {
    targetCountRef.current = formValues.files.length;
    isUploading.current = true;
    formValues.files.map((file) =>
      getPresignUrlS3(
        {
          projectId,
          region: s3.region,
          name: s3.name,
          data: {
            expire: 3600,
            method: storages.PresignedURLMethodEnum.PUT,
            object: formValues.prefix
              ? `${formValues.prefix}/${file.name}`
              : file.name,
            storageClass: formValues.storageClass,
            versionId: '',
          },
        },
        file,
      ),
    );
  };

  return {
    onSubmit,
    isUploading: isUploading.current,
    uploadedFilesCount: uploadedCountRef.current,
    totalFilesToUploadCount: targetCountRef.current,
  };
};
