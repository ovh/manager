import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { database as dbTypes } from '@/models/database';
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
import { useDeleteDatabase } from '@/hooks/api/databases.api.hook';

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
        description: err.response.data.message,
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
          <DialogTitle>{t('deleteDatabaseTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteDatabaseDescription', { name: database.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('deleteDatabaseButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleDelete}>
            {t('deleteDatabaseButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDatabase;
