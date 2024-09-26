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
import { IntegrationWithServices } from '../Integrations.page';
import { useDeleteIntegration } from '@/hooks/api/database/integration/useDeleteIntegration.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface DeleteIntegrationProps {
  service: dbTypes.Service;
  controller: ModalController;
  integration: IntegrationWithServices;
  onSuccess?: (integration: IntegrationWithServices) => void;
  onError?: (error: Error) => void;
}

const DeleteIntegration = ({
  service,
  integration,
  controller,
  onError,
  onSuccess,
}: DeleteIntegrationProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/integrations',
  );
  const toast = useToast();
  const { deleteIntegration, isPending } = useDeleteIntegration({
    onError: (err) => {
      toast.toast({
        title: t('deleteIntegrationToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteIntegrationToastSuccessTitle'),
        description: t('deleteIntegrationToastSuccessDescription', {
          type: integration.type,
        }),
      });
      if (onSuccess) {
        onSuccess(integration);
      }
    },
  });

  const handleDelete = () => {
    deleteIntegration({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      integrationId: integration.id,
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-integrations-modal">
            {t('deleteIntegrationTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteIntegrationDescription', { type: integration.type })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-integrations-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteIntegrationButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-integrations-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteIntegrationButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIntegration;
