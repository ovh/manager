import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Button,
  useToast,
  Input,
  Alert,
  AlertDescription,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  DialogBody,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useDeleteService } from '@/data/hooks/database/service/useDeleteService.hook';
import { useGetServices } from '@/data/hooks/database/service/useGetServices.hook';
import { useTrackAction } from '@/hooks/useTracking.hook';
import { TRACKING } from '@/configuration/tracking.constants';
import { useGetIntegrations } from '@/data/hooks/database/integration/useGetIntegrations.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal.component';

interface DeleteServiceModalProps {
  service: database.Service;
  onSuccess?: (service: database.Service) => void;
  onError?: (service: Error) => void;
}

const DeleteService = ({
  service,
  onError,
  onSuccess,
}: DeleteServiceModalProps) => {
  const { projectId } = useParams();
  const track = useTrackAction();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');
  const integrationsQuery = useGetIntegrations(
    projectId,
    service?.engine,
    service?.id,
    {
      enabled:
        !!service?.id &&
        service?.capabilities.integrations?.read ===
          database.service.capability.StateEnum.enabled,
    },
  );
  const servicesQuery = useGetServices(projectId, {
    enabled: !!integrationsQuery.data,
  });

  const integratedServices = useMemo(() => {
    // return empty arrray if there are no integrations for
    // the selected engine (eg mongoDB)
    if (
      service?.capabilities.integrations?.read !==
      database.service.capability.StateEnum.enabled
    ) {
      return [];
    }
    if (!integrationsQuery.data || !servicesQuery.data) return null;
    return servicesQuery.data.filter((serv) =>
      integrationsQuery.data.find(
        (integration) =>
          (integration.destinationServiceId === serv.id &&
            integration.destinationServiceId !== service.id) ||
          (integration.sourceServiceId === serv.id &&
            integration.sourceServiceId !== service.id),
      ),
    );
  }, [integrationsQuery, servicesQuery]);

  const { deleteService, isPending } = useDeleteService({
    onError: (err) => {
      track(
        TRACKING.deleteService.failure(service.engine, service.nodes[0].region),
      );
      toast.toast({
        title: t('deleteServiceToastErrorTitle'),
        variant: 'critical',
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
    <RouteModal isLoading={!service?.id || !integratedServices}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-service-modal">
            {t('deleteServiceTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {integratedServices?.length > 0 && (
            <Alert variant="information">
              <div>
                <AlertDescription className="text-base">
                  <div className="flex flex-row items-center gap-4">
                    <AlertTriangle className="h-4 w-4" />
                    <p>
                      {t(
                        integratedServices.length === 1
                          ? 'deleteServiceIntegrationDescription'
                          : 'deleteServiceIntegrationsDescription',
                      )}
                    </p>
                  </div>
                  <ul className="list-disc pl-5 text-sm">
                    {integratedServices.map((integratedService) => (
                      <li className="ml-3" key={integratedService.id}>
                        {integratedService.description}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </div>
            </Alert>
          )}
          <p className="mt-2">
            {t('deleteServiceDescription', {
              name: service?.description,
            })}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="terminateInput">
              {t('deleteServiceConfirmation')}
            </Label>
            <Input
              id="terminateInput"
              data-testid="delete-service-confirmation-input"
              type="text"
              placeholder="TERMINATE"
              onChange={(event) => {
                setConfirmationInput(event.target.value);
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              data-testid="delete-service-cancel-button"
              type="button"
              mode="ghost"
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
              servicesQuery.isLoading ||
              integrationsQuery.isLoading ||
              confirmationInput !== TERMINATE_CONFIRMATION
            }
            onClick={handleDelete}
          >
            {t('deleteServiceButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteService;
