import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
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

import { ModalController } from '@/hooks/useModale';

import { database } from '@/models/database';
import {
  useDeleteService,
  useGetServices,
} from '@/hooks/api/services.api.hooks';
import { useGetIntegrations } from '@/hooks/api/integrations.api.hook';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
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
      toast.toast({
        title: t('deleteServiceToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
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
          <DialogTitle>{t('deleteServiceTitle')}</DialogTitle>
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
                  <ul className="list-disc pl-5">
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
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('deleteServiceButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={
              isPending ||
              serivcesQuery.isLoading ||
              integrationsQuery.isLoading
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
