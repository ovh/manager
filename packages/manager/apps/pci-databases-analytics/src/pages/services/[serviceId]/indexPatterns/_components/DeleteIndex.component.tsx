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

import { ModalController } from '@/hooks/useModale';

import * as database from '@/types/cloud/project/database';
import { useDeleteIndex } from '@/hooks/api/database/indexes/useDeleteIndex.hook';
import { useServiceData } from '../../Service.context';

interface DeleteIndexModalProps {
  service: database.Service;
  controller: ModalController;
  index: database.opensearch.Index;
  onSuccess?: (index: database.opensearch.Index) => void;
  onError?: (error: Error) => void;
}

const DeleteIndexModal = ({
  service,
  index,
  controller,
  onError,
  onSuccess,
}: DeleteIndexModalProps) => {
  const { projectId } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { deleteIndex, isPending } = useDeleteIndex({
    onError: (err) => {
      toast.toast({
        title: t('deleteIndexToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.details.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteIndexToastSuccessTitle'),
        description: t('deleteIndexToastSuccessDescription', {
          name: index.name,
        }),
      });
      if (onSuccess) {
        onSuccess(index);
      }
    },
  });

  const handleDelete = () => {
    deleteIndex({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      indexId: index.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-indexs-modal">
            {t('deleteIndexTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteIndexDescription', {
              name: index.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-indexs-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteIndexButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-indexs-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteIndexButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIndexModal;
