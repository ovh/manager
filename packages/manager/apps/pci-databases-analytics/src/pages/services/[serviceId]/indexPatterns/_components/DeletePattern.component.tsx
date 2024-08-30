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
import { useDeletePattern } from '@/hooks/api/database/pattern/useDeletePattern.hook';
import { useServiceData } from '../../Service.context';

interface DeletePatternModalProps {
  service: database.Service;
  controller: ModalController;
  pattern: database.opensearch.Pattern;
  onSuccess?: (pattern: database.opensearch.Pattern) => void;
  onError?: (error: Error) => void;
}

const DeletePatternModal = ({
  service,
  pattern,
  controller,
  onError,
  onSuccess,
}: DeletePatternModalProps) => {
  const { projectId } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { deletePattern, isPending } = useDeletePattern({
    onError: (err) => {
      toast.toast({
        title: t('deletePatternToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.details.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deletePatternToastSuccessTitle'),
        description: t('deletePatternToastSuccessDescription', {
          name: pattern.pattern,
        }),
      });
      if (onSuccess) {
        onSuccess(pattern);
      }
    },
  });

  const handleDelete = () => {
    deletePattern({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      patternId: pattern.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-patterns-modal">
            {t('deletePatternTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deletePatternDescription', {
              name: pattern.pattern,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-patterns-cancel-button"
              type="button"
              variant="outline"
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
    </Dialog>
  );
};

export default DeletePatternModal;
