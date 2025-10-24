import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  useToast,
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useUpdateS3ObjectStorageClass } from '@/data/hooks/s3-storage/useUpdateS3ObjectStorageClass.hook';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import { useS3Data } from '../../../S3.context';
import storages from '@/types/Storages';
import RouteModal from '@/components/route-modal/RouteModal';
import StorageClassSelector from '@/components/storage-class-selector/StorageClassSelector.component';

const ChangeStorageClassModal = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const { s3 } = useS3Data();
  const navigate = useNavigate();
  const toast = useToast();

  const objectQuery = useGetS3Object({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  // TODO: Api should return list of available service for a container
  const is3AZ = s3.region === 'EU-WEST-PAR';

  const [storageClass, setStorageClass] = useState<storages.StorageClassEnum>(
    objectQuery.data?.storageClass || storages.StorageClassEnum.STANDARD,
  );

  const { updateObjectStorageClass, isPending } = useUpdateS3ObjectStorageClass(
    {
      onError: (err) => {
        toast.toast({
          title: t('objectToastErrorTitle'),
          variant: 'destructive',
          description: getObjectStoreApiErrorMessage(err),
        });
      },
      onSuccess: () => {
        toast.toast({
          title: t('changeStorageClassSuccessTitle'),
          description: t('changeStorageClassSuccessDescription'),
        });
        navigate('../');
      },
    },
  );

  const handleSubmit = () => {
    if (!objectKey || !objectQuery.data) return;

    updateObjectStorageClass({
      projectId,
      region: s3.region,
      name: s3.name,
      key: objectKey,
      storageClass,
      versionId: objectQuery.data.versionId,
    });
  };

  return (
    <RouteModal isLoading={objectQuery.isLoading || !objectQuery.data}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('changeStorageClassTitle')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">{t('changeStorageClassDescription')}</p>
          <StorageClassSelector
            storageClass={storageClass}
            onStorageClassChange={setStorageClass}
            is3AZ={is3AZ}
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
              {t('changeStorageClassCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isPending ||
              storageClass === objectQuery.data?.storageClass ||
              !objectQuery.data
            }
          >
            {t('changeStorageClassConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ChangeStorageClassModal;
