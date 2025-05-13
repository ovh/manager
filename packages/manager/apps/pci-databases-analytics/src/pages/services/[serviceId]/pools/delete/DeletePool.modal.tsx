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
import { useDeleteConnectionPool } from '@/hooks/api/database/connectionPool/useDeleteConnectionPool.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetConnectionPools } from '@/hooks/api/database/connectionPool/useGetConnectionPools.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeletePool = () => {
  const { projectId, poolId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const poolsQuery = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const pools = poolsQuery.data;
  const deletedPool = pools?.find((p) => p.id === poolId);

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
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteConnectionPoolToastSuccessTitle'),
        description: t('deleteConnectionPoolToastSuccessDescription', {
          name: deletedPool.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (pools && !deletedPool) navigate('../');
  }, [pools, deletedPool]);

  const handleDelete = () => {
    deleteConnectionPool({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      connectionPoolId: deletedPool.id,
    });
  };

  return (
    <RouteModal isLoading={!pools || !deletedPool}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-pools-modal">
            {t('deleteConnectionPoolTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteConnectionPoolDescription', {
              name: deletedPool?.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-pools-cancel-button"
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default DeletePool;
