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
import { useDeleteIndex } from '@/hooks/api/database/indexes/useDeleteIndex.hook';
import { useServiceData } from '../../Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetIndexes } from '@/hooks/api/database/indexes/useGetIndexes.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteIndexModal = () => {
  const { projectId, indexId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const indexesQuery = useGetIndexes(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });

  const indexes = indexesQuery.data;
  const deletedIndex = indexes?.find((i) => i.id === indexId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { deleteIndex, isPending } = useDeleteIndex({
    onError: (err) => {
      toast.toast({
        title: t('deleteIndexToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteIndexToastSuccessTitle'),
        description: t('deleteIndexToastSuccessDescription', {
          name: deletedIndex.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (indexes && !deletedIndex) navigate('../');
  }, [indexes, deletedIndex]);

  const handleDelete = () => {
    deleteIndex({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      indexId: deletedIndex.id,
    });
  };
  return (
    <RouteModal isLoading={!indexes || !deletedIndex}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-indexes-modal">
            {t('deleteIndexTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteIndexDescription', {
              name: deletedIndex?.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-indexes-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteIndexButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-indexes-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteIndexButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteIndexModal;
