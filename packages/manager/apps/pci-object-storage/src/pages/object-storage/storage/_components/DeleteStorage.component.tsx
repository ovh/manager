import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
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
} from '@datatr-ux/uxlib';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal';
import storages, { ObjectStorageTypeEnum } from '@/types/Storages';
import { useDeleteStorage } from '@/data/hooks/storage/useDeleteStorage.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

interface DeleteStorageModalProps {
  storage: storages.ContainerDetail | StorageContainer;
  type: ObjectStorageTypeEnum;
  storageId: string;
  onSuccess?: (storage: storages.ContainerDetail | StorageContainer) => void;
  onError?: (err: Error) => void;
}

const DeleteStorage = ({
  storage,
  type,
  storageId,
  onError,
  onSuccess,
}: DeleteStorageModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-object-storage/storages/delete');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');

  const { deleteStorage, isPending } = useDeleteStorage({
    storageType: type,
    onError: (err) => {
      toast.toast({
        title: t('deleteStorageToastErrorTitle'),
        variant: 'destructive',
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
          name: storage.name,
        }),
      });
      if (onSuccess) {
        onSuccess(storage);
      }
    },
  });

  const handleDelete = () => {
    if (type === ObjectStorageTypeEnum.s3) {
      deleteStorage({
        projectId,
        name: storageId,
        region: storage.region,
      });
    }
    if (type === ObjectStorageTypeEnum.swift) {
      deleteStorage({
        projectId,
        containerId: storageId,
      });
    }
  };

  return (
    <RouteModal isLoading={!storage}>
      <DialogContent className="p-0">
        <DialogHeader className="bg-warning-100 p-6 rounded-t-sm sm:rounded-t-lg ">
          <DialogTitle data-testid="delete-storage-modal">
            {t('deleteStorageTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <p className="mt-2">
            {t('deleteStorageDescription', {
              name: storage?.name,
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
        </div>
        <DialogFooter className="flex justify-end p-6 pt-0">
          <DialogClose asChild>
            <Button
              data-testid="delete-storage-cancel-button"
              type="button"
              mode="outline"
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

export default DeleteStorage;
