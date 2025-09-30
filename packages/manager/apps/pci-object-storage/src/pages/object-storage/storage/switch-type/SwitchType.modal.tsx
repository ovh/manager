import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';

import storages from '@/types/Storages';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';
import { useEditSwift } from '@/data/hooks/swift-storage/useEditSwift.hook';

const SwithType = () => {
  const { projectId, containerId } = useParams();
  const storageQuery = useGetSwift({ projectId, containerId, noObjects: true });
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/switch-type');
  const toast = useToast();

  const { editSwift, isPending } = useEditSwift({
    onError: (err) => {
      toast.toast({
        title: t('updateContainerToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('updateContainerToastSuccessTitle'),
        description: t('updateContainerToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const handleSubmit = () => {
    editSwift({
      projectId,
      containerId,
      data: {
        containerType:
          storageQuery.data.containerType === storages.TypeEnum.public
            ? storages.TypeEnum.private
            : storages.TypeEnum.public,
      },
    });
  };

  return (
    <RouteModal isLoading={!storageQuery.data?.name}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="switch-type-modal">
            {t('switchTypeTitle')}
          </DialogTitle>
          <DialogDescription>
            {storageQuery.data?.containerType === storages.TypeEnum.public
              ? t('switchToPrivateDescription')
              : t('switchToPublicDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
              {t('switchTypeButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            data-testid="switch-type-submit-button"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {t('switchTypeButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default SwithType;
