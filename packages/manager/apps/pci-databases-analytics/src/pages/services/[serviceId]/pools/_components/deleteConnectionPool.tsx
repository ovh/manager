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

import { ModalController } from '@/hooks/useModale';
import { useDeleteConnectionPool } from '@/hooks/api/connectionPool.api.hooks';

import { database } from '@/models/database';

interface DeleteConnectionPoolModalProps {
  service: database.Service;
  controller: ModalController;
  connectionPool: database.postgresql.ConnectionPool;
  onSuccess?: (connectionPool: database.postgresql.ConnectionPool) => void;
  onError?: (connectionPool: Error) => void;
}

const DeleteConnectionPool = ({
  service,
  connectionPool,
  controller,
  onError,
  onSuccess,
}: DeleteConnectionPoolModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const toast = useToast();
  const { deleteConnectionPool, isPending } = useDeleteConnectionPool({
    onError: (err) => {
      toast.toast({
        title: t('deleteConnectionPoolToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteConnectionPoolToastSuccessTitle'),
        description: t('deleteConnectionPoolToastSuccessDescription', {
          name: connectionPool.name,
        }),
      });
      if (onSuccess) {
        onSuccess(connectionPool);
      }
    },
  });

  const handleDelete = () => {
    deleteConnectionPool({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      connectionPoolId: connectionPool.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteConnectionPoolTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteConnectionPoolDescription', {
              name: connectionPool.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('deleteConnectionPoolButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleDelete}>
            {t('deleteConnectionPoolButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConnectionPool;
