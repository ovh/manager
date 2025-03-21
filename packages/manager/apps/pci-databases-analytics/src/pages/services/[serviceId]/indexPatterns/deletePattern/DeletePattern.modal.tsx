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

import { useDeletePattern } from '@/hooks/api/database/pattern/useDeletePattern.hook';
import { useServiceData } from '../../Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetPatterns } from '@/hooks/api/database/pattern/useGetPatterns.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeletePatternModal = () => {
  const { projectId, patternId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const patternsQuery = useGetPatterns(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });

  const patterns = patternsQuery.data;
  const deletedPattern = patterns?.find((p) => p.id === patternId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { deletePattern, isPending } = useDeletePattern({
    onError: (err) => {
      toast.toast({
        title: t('deletePatternToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deletePatternToastSuccessTitle'),
        description: t('deletePatternToastSuccessDescription', {
          name: deletedPattern.pattern,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (patterns && !deletedPattern) navigate('../');
  }, [patterns, deletedPattern]);

  const handleDelete = () => {
    deletePattern({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      patternId: deletedPattern.id,
    });
  };
  return (
    <RouteModal isLoading={!patterns || !deletedPattern}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-patterns-modal">
            {t('deletePatternTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deletePatternDescription', {
              name: deletedPattern?.pattern,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-patterns-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deletePatternButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-patterns-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deletePatternButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeletePatternModal;
