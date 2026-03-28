import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
import { useDeleteDatabase } from '@/data/hooks/database/database/useDeleteDatabase.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetDatabases } from '@/data/hooks/database/database/useGetDatabases.hook';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal.component';

const DeleteDatabase = () => {
  // import translations
  const { projectId, databaseId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const databases = databasesQuery.data;
  const deletedDatabase = databases?.find((d) => d.id === databaseId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/databases',
  );
  const toast = useToast();
  const { deleteDatabase, isPending } = useDeleteDatabase({
    onError: (err) => {
      toast.toast({
        title: t('deleteDatabaseToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteDatabaseToastSuccessTitle'),
        description: t('deleteDatabaseToastSuccessDescription', {
          name: deletedDatabase.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (databases && !deletedDatabase) navigate('../');
  }, [databases, deletedDatabase]);

  const handleDelete = () => {
    deleteDatabase({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      databaseId: deletedDatabase.id,
    });
  };

  return (
    <RouteModal isLoading={!databases || !deletedDatabase}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-database-modal">
            {t('deleteDatabaseTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDatabaseDescription', { name: deletedDatabase?.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
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
    </RouteModal>
  );
};

export default DeleteDatabase;
