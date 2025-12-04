import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Button,
  useToast,
  Input,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  DialogBody,
} from '@datatr-ux/uxlib';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal';
import storages from '@/types/Storages';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteSwift } from '@/data/hooks/swift-storage/useDeleteSwift.hook';

interface DeleteSwiftModalProps {
  swift: storages.ContainerDetail;
  swiftId: string;
  onSuccess?: (storage: storages.ContainerDetail) => void;
}

const DeleteSwift = ({ swift, swiftId, onSuccess }: DeleteSwiftModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-object-storage/storages/delete');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');

  const { deleteSwift, isPending } = useDeleteSwift({
    onError: (err) => {
      toast.toast({
        title: t('deleteStorageToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteStorageToastSuccessTitle'),
        description: t('deleteStorageToastSuccessDescription', {
          name: swift.name,
        }),
      });
      if (onSuccess) {
        onSuccess(swift);
      }
    },
  });

  const handleDelete = () => {
    deleteSwift({
      projectId,
      containerId: swiftId,
    });
  };

  return (
    <RouteModal isLoading={!swift}>
      <DialogContent className="p-0" variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-storage-modal">
            {t('deleteStorageTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mt-2">
            {t('deleteStorageDescription', {
              name: swift?.name,
            })}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="terminateInput">
              {t('deleteStorageConfirmation')}
            </Label>
            <Input
              id="terminateInput"
              data-testid="delete-storage-confirmation-input"
              type="text"
              placeholder="TERMINATE"
              onChange={(event) => {
                setConfirmationInput(event.target.value);
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              data-testid="delete-storage-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('deleteStorageButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-storage-submit-button"
            type="button"
            disabled={isPending || confirmationInput !== TERMINATE_CONFIRMATION}
            onClick={handleDelete}
          >
            {t('deleteStorageButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteSwift;
