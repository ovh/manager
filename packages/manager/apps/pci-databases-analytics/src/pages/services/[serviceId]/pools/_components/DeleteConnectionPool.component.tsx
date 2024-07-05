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

import * as database from '@/types/cloud/project/database';
import { useDeleteConnectionPool } from '@/hooks/api/database/connectionPool/useDeleteConnectionPool.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

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
        description: getCdbApiErrorMessage(err),
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
          <DialogTitle data-testid="delete-pools-modal">
            {t('deleteConnectionPoolTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteConnectionPoolDescription', {
              name: connectionPool.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-pools-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteConnectionPoolButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-pools-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteConnectionPoolButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConnectionPool;
