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
import { useDeleteIntegration } from '@/hooks/api/database/integration/useDeleteIntegration.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteIntegration = () => {
  const { projectId, integrationId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const integrations = integrationsQuery.data;
  const deletedIntegration = integrations?.find((i) => i.id === integrationId);
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
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteIntegrationToastSuccessTitle'),
        description: t('deleteIntegrationToastSuccessDescription', {
          type: deletedIntegration.type,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (integrations && !deletedIntegration) navigate('../');
  }, [integrations, deletedIntegration]);

  const handleDelete = () => {
    deleteIntegration({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      integrationId: deletedIntegration.id,
    });
  };

  return (
    <RouteModal isLoading={!integrations || !deletedIntegration}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-integrations-modal">
            {t('deleteIntegrationTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteIntegrationDescription', {
              type: deletedIntegration?.type,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-integrations-cancel-button"
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default DeleteIntegration;
