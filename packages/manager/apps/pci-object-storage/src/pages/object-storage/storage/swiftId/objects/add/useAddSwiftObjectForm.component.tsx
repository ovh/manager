import { useToast } from '@datatr-ux/uxlib';
import { useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import storages from '@/types/Storages';
import { useAddSwiftObject } from '@/data/hooks/swift-storage/useAddSwiftObject.hook';
import { useGetStorageAccess } from '@/data/hooks/storage/useGetStorageAccess.hook';
import { useSwiftData } from '../../Swift.context';

export const useAddSwiftObjectForm = ({
  onUploadEnd,
}: {
  onUploadEnd: () => void;
}) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const toast = useToast();
  const { projectId } = useParams();
  const { swift } = useSwiftData();

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

  const { addSwiftObject } = useAddSwiftObject({
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

  const { mutateAsync: getStorageAccess } = useGetStorageAccess({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {},
  });

  const onSubmit: SubmitHandler<{
    prefix?: string;
    storageClass?: storages.StorageClassEnum;
    files?: File[];
  }> = async (formValues) => {
    targetCountRef.current = formValues.files.length;
    isUploading.current = true;
    const access = await getStorageAccess({ projectId });
    const swiftUrl = access.endpoints.find(
      (endpoint) => endpoint.region === swift.region,
    ).url;
    if (!swiftUrl) return;
    formValues.files.map((file) =>
      addSwiftObject({
        url: `${swiftUrl}/${swift.name}/${encodeURIComponent(
          formValues.prefix ? `${formValues.prefix}/${file.name}` : file.name,
        )}`,
        file,
        token: access.token,
      }),
    );
  };

  return {
    onSubmit,
    isUploading: isUploading.current,
    uploadedFilesCount: uploadedCountRef.current,
    totalFilesToUploadCount: targetCountRef.current,
  };
};
