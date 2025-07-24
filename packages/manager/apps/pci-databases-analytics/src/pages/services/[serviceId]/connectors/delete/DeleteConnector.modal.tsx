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
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetConnectors } from '@/hooks/api/database/connector/useGetConnectors.hook';
import { useDeleteConnector } from '@/hooks/api/database/connector/useDeleteConnector.hook';

const DeleteConnector = () => {
  const { projectId, connectorId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const connectorsQuery = useGetConnectors(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const connectors = connectorsQuery.data;
  const deletedConnector = connectors?.find((c) => c.id === connectorId);
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );
  const toast = useToast();
  const { deleteConnector, isPending } = useDeleteConnector({
    onError: (err) => {
      toast.toast({
        title: t('deleteConnectorToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteConnectorToastSuccessTitle'),
        description: t('deleteConnectorToastSuccessDescription', {
          name: deletedConnector.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (connectors && !deletedConnector) navigate('../');
  }, [connectors, deletedConnector]);

  const handleDelete = () => {
    deleteConnector({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      connectorId: deletedConnector.id,
    });
  };

  return (
    <RouteModal isLoading={!connectors || !deletedConnector}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-connector-modal">
            {t('deleteConnectorTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteConnectorDescription', {
              name: deletedConnector?.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-connector-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteConnectorButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-connector-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteConnectorButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteConnector;
