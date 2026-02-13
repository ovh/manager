import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud';
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
import { useDeleteS3 } from '@/data/hooks/s3-storage/useDeleteS3.hook';

interface DeleteS3ModalProps {
  s3: StorageContainer;
  onSuccess?: (storage: storages.ContainerDetail | StorageContainer) => void;
  onError?: (err: Error) => void;
}

const DeleteS3 = ({ s3, onError, onSuccess }: DeleteS3ModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-object-storage/storages/delete');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');

  const { deleteS3, isPending } = useDeleteS3({
    onError: (err) => {
      toast.toast({
        title: t('deleteStorageToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteStorageToastSuccessTitle'),
        description: t('deleteStorageToastSuccessDescription', {
          name: s3.name,
        }),
      });
      if (onSuccess) {
        onSuccess(s3);
      }
    },
  });

  const handleDelete = () => {
    deleteS3({
      projectId,
      name: s3.name,
      region: s3.region,
    });
  };

  return (
    <RouteModal isLoading={!s3}>
      <DialogContent className="p-0" variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-storage-modal">
            {t('deleteStorageTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mt-2">
            {t('deleteStorageDescription', {
              name: s3?.name,
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

export default DeleteS3;
