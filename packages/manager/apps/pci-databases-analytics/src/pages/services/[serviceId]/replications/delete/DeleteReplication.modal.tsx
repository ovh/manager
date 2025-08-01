import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetReplications } from '@/hooks/api/database/replication/useGetReplications.hook';
import { useDeleteReplication } from '@/hooks/api/database/replication/useDeleteReplication.hook';

const DeleteReplicationModal = () => {
  const { projectId, replicationId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const replicationsQuery = useGetReplications(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const replications = replicationsQuery.data;
  const deletedReplication = replications?.find((n) => n.id === replicationId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/replications',
  );
  const toast = useToast();
  const { deleteReplication, isPending } = useDeleteReplication({
    onError: (err) => {
      toast.toast({
        title: t('deleteReplicationToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('formReplicationToastSuccessTitle'),
        description: t('deleteReplicationToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (replications && !deletedReplication) navigate('../');
  }, [replications, deletedReplication]);

  const handleDelete = () => {
    deleteReplication({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      replicationId: deletedReplication.id,
    });
  };

  return (
    <RouteModal isLoading={!replications || !deletedReplication}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-replications-modal">
            {t('deleteReplicationTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteReplicationDescription', {
              name: deletedReplication?.id,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-replications-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteReplicationButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-replications-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteReplicationButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteReplicationModal;
