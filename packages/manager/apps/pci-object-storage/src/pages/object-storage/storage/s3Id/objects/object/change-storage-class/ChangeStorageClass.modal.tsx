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
  DialogBody,
} from '@datatr-ux/uxlib';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useUpdateS3ObjectStorageClass } from '@/data/hooks/s3-storage/useUpdateS3ObjectStorageClass.hook';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import { useS3Data } from '../../../S3.context';
import storages from '@/types/Storages';
import RouteModal from '@/components/route-modal/RouteModal';
import StorageClassSelector from '@/components/storage-class-selector/StorageClassSelector.component';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';

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

  const availableStorageClasses = useAvailableStorageClasses(s3.region);

  const [storageClass, setStorageClass] = useState<storages.StorageClassEnum>(
    objectQuery.data?.storageClass || storages.StorageClassEnum.STANDARD,
  );

  const { updateObjectStorageClass, isPending } = useUpdateS3ObjectStorageClass(
    {
      onError: (err) => {
        toast.toast({
          title: t('objectToastErrorTitle'),
          variant: 'critical',
          description: getObjectStoreApiErrorMessage(err),
        });
      },
      onSuccess: () => {
        toast.toast({
          title: t('changeStorageClassSuccessTitle'),
          description: t('changeStorageClassSuccessDescription'),
        });
        navigate(`../../object?objectKey=${encodeURIComponent(objectKey)}`);
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
    <RouteModal
      isLoading={objectQuery.isLoading || !objectQuery.data}
      backUrl={`../../object?objectKey=${encodeURIComponent(objectKey)}`}
    >
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle>{t('changeStorageClassTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mb-4">{t('changeStorageClassDescription')}</p>
          <StorageClassSelector
            storageClass={storageClass}
            onStorageClassChange={setStorageClass}
            availableStorageClasses={availableStorageClasses}
          />
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
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
