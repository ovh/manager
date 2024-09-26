import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import * as dbTypes from '@/types/cloud/project/database';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteDatabase } from '@/hooks/api/database/database/useDeleteDatabase.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface DeleteDatabaseModalProps {
  service: dbTypes.Service;
  controller: ModalController;
  database: dbTypes.service.Database;
  onSuccess?: (database: dbTypes.service.Database) => void;
  onError?: (error: Error) => void;
}

const DeleteDatabase = ({
  service,
  database,
  controller,
  onError,
  onSuccess,
}: DeleteDatabaseModalProps) => {
  // import translations
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/databases',
  );
  const toast = useToast();
  const { deleteDatabase, isPending } = useDeleteDatabase({
    onError: (err) => {
      toast.toast({
        title: t('deleteDatabaseToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteDatabaseToastSuccessTitle'),
        description: t('deleteDatabaseToastSuccessDescription', {
          name: database.name,
        }),
      });
      if (onSuccess) {
        onSuccess(database);
      }
    },
  });

  const handleDelete = () => {
    deleteDatabase({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      databaseId: database.id,
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-database-modal">
            {t('deleteDatabaseTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDatabaseDescription', { name: database.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              data-testid="delete-database-cancel-button"
            >
              {t('deleteDatabaseButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            data-testid="delete-database-submit-button"
          >
            {t('deleteDatabaseButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDatabase;
