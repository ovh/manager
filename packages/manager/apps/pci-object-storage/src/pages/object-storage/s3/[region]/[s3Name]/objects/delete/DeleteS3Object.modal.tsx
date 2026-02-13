import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {
  Button,
  useToast,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteS3Object } from '@/data/hooks/s3-storage/useDeleteS3Object.hook';
import { useS3Data } from '../../S3.context';

const DeleteSwiftObject = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const objectKey = searchParams.get('objectKey');
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const toast = useToast();

  if (!objectKey) return navigate('../');

  const { deleteS3Object, isPending: deletePending } = useDeleteS3Object({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('objectToastSuccessTitle'),
        description: t('deleteObjectToastSuccessDescription', {
          name: objectKey,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteS3Object({
      projectId,
      region: s3.region,
      name: s3.name,
      key: objectKey,
    });
  };

  return (
    <RouteModal isLoading={!projectId && !objectKey}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle>{t('deleteObjectTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mt-2 break-all">
            {t('deleteObjectDescription', {
              name: objectKey,
            })}
          </p>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('deleteObjectButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="button" disabled={deletePending} onClick={handleDelete}>
            {t('deleteObjectButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteSwiftObject;
