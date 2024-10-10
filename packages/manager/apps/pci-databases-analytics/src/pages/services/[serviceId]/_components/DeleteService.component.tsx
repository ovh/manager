import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

import { ModalController } from '@/hooks/useModale';

import * as database from '@/types/cloud/project/database';
import { useDeleteService } from '@/hooks/api/database/service/useDeleteService.hook';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTrackAction, useTrackPage } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';

interface DeleteServiceModalProps {
  service: database.Service;
  controller: ModalController;
  onSuccess?: (service: database.Service) => void;
  onError?: (service: Error) => void;
}

const DeleteService = ({
  service,
  controller,
  onError,
  onSuccess,
}: DeleteServiceModalProps) => {
  const { projectId } = useParams();
  useTrackPage(
    TRACKING.deleteService.page(service.engine, service.nodes[0].region),
  );
  const track = useTrackAction();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');
  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      enabled:
        service.capabilities.integrations?.read ===
        database.service.capability.StateEnum.enabled,
    },
  );
  const serivcesQuery = useGetServices(projectId, {
    enabled: integrationsQuery.isSuccess && integrationsQuery.data?.length > 0,
  });

  const integratedServices = useMemo(() => {
    if (
      !integrationsQuery.isSuccess ||
      !serivcesQuery.isSuccess ||
      integrationsQuery.data.length === 0
    )
      return [];
    return serivcesQuery.data.filter((serv) =>
      integrationsQuery.data.find(
        (integration) =>
          (integration.destinationServiceId === serv.id &&
            integration.destinationServiceId !== service.id) ||
          (integration.sourceServiceId === serv.id &&
            integration.sourceServiceId !== service.id),
      ),
    );
  }, [integrationsQuery.data, serivcesQuery.data]);

  const { deleteService, isPending } = useDeleteService({
    onError: (err) => {
      track(
        TRACKING.deleteService.failure(service.engine, service.nodes[0].region),
      );
      toast.toast({
        title: t('deleteServiceToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onDeleteSuccess: () => {
      track(
        TRACKING.deleteService.success(service.engine, service.nodes[0].region),
      );
      toast.toast({
        title: t('deleteServiceToastSuccessTitle'),
        description: t('deleteServiceToastSuccessDescription', {
          name: service.description,
        }),
      });
      if (onSuccess) {
        onSuccess(service);
      }
    },
  });

  const handleDelete = () => {
    track(
      TRACKING.deleteService.confirm(service.engine, service.nodes[0].region),
    );
    deleteService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-service-modal">
            {t('deleteServiceTitle')}
          </DialogTitle>
        </DialogHeader>
        {integratedServices.length > 0 && (
          <Alert variant="info">
            <AlertDescription className="mt-2 text-base">
              <div className="flex flex-row gap-5 items-center text-foreground">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  {integratedServices.length === 1 ? (
                    <p>{t('deleteServiceIntegrationDescription')}</p>
                  ) : (
                    <p>{t('deleteServiceIntegrationsDescription')}</p>
                  )}
                  <ul className="list-disc pl-5 text-sm">
                    {integratedServices.map((integratedService) => (
                      <li className="ml-3" key={integratedService.id}>
                        {integratedService.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <p className="mt-2">
          {t('deleteServiceDescription', {
            name: service.description,
          })}
        </p>
        <div className="flex flex-col gap-2">
          <p>{t('deleteServiceConfirmation')}</p>
          <Input
            data-testid="delete-service-confirmation-input"
            type="text"
            onChange={(event) => {
              setConfirmationInput(event.target.value);
            }}
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-service-cancel-button"
              type="button"
              variant="outline"
              onClick={() =>
                track(
                  TRACKING.deleteService.cancel(
                    service.engine,
                    service.nodes[0].region,
                  ),
                )
              }
            >
              {t('deleteServiceButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-service-submit-button"
            type="button"
            disabled={
              isPending ||
              serivcesQuery.isLoading ||
              integrationsQuery.isLoading ||
              confirmationInput !== TERMINATE_CONFIRMATION
            }
            onClick={handleDelete}
          >
            {t('deleteServiceButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteService;
