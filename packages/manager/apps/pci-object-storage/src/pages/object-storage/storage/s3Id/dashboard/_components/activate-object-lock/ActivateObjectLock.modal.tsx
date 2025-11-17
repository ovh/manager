import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ObjectLockStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/ObjectLockStatusEnum';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';

const ActivateObjectLock = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, region, s3Name } = useParams();
  const s3Query = useGetS3({ projectId, region, name: s3Name });

  const { udpateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
        description: t('activateObjectLockToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = () => {
    udpateS3Storage({
      projectId,
      region,
      name: s3Name,
      data: {
        objectLock: {
          status: ObjectLockStatusEnum.enabled,
        },
      },
    });
  };

  return (
    <RouteModal isLoading={!s3Query.data?.name}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="s3-policy-modal">
            {t('activateObjectLockTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{t('activateObjectLockDescription')}</p>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('cancelButton')}
            </Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} disabled={isPending}>
            {t('activateButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ActivateObjectLock;
