import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ModalController } from '@/hooks/useModale.hook';
import * as ai from '@/types/cloud/project/ai';
import { useDeleteDatastore } from '@/hooks/api/ai/datastore/useDeleteDatastore.hook';
import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';

interface DeleteDatastoreModalProps {
  datastore: DataStoresWithRegion;
  controller: ModalController;
  onSuccess?: (datastore: ai.DataStore) => void;
  onError?: (error: Error) => void;
}

const DeleteDatastore = ({
  datastore,
  controller,
  onError,
  onSuccess,
}: DeleteDatastoreModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/datastores');
  const toast = useToast();
  const { deleteDatastore, isPending } = useDeleteDatastore({
    onError: (err) => {
      toast.toast({
        title: t('deleteDatastoreToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteDatastoreToastSuccessTitle'),
        description: t('deleteDatastoreToastSuccessDescription', {
          alias: datastore.alias,
        }),
      });
      if (onSuccess) {
        onSuccess(datastore);
      }
    },
  });

  const handleDelete = () => {
    deleteDatastore({
      projectId,
      region: datastore.region,
      alias: datastore.alias,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-datastore-modal">
            {t('deleteDatastoreTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDatastoreDescription', {
              alias: datastore.alias,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-datastore-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteDatastoreButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-datastore-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteDatastoreButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDatastore;
