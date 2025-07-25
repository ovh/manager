import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  useToast,
} from '@datatr-ux/uxlib';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { getColumns } from './_components/ConnectorsTableColumns.component';
import DataTable from '@/components/data-table';
import { useGetConnectorsCapabilities } from '@/hooks/api/database/connector/useGetConnectorsCapabilities.hook';
import { useGetConnectors } from '@/hooks/api/database/connector/useGetConnectors.hook';
import { usePauseConnector } from '@/hooks/api/database/connector/usePauseConnector.hook';
import { useResumeConnector } from '@/hooks/api/database/connector/useResumeConnector.hook';
import { useRestartConnector } from '@/hooks/api/database/connector/useRestartConnector.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { CdbError } from '@/data/api/database';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';
import Link from '@/components/links/Link.component';

export interface ConnectorWithCapability
  extends database.kafkaConnect.Connector {
  capabilities: database.kafkaConnect.capabilities.Connector;
}

const Connectors = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const toast = useToast();

  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
  );

  const connectorsCapabilitiesQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectorsQuery = useGetConnectors(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!connectorsCapabilitiesQuery.data?.length,
    },
  );

  const connectorActionCallbacks = (
    action: 'pause' | 'resume' | 'restart',
  ) => ({
    onError: (err: CdbError) => {
      toast.toast({
        title: t(`${action}ConnectorToastErrorTitle`),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t(`${action}ConnectorToastSuccessTitle`),
      });
    },
  });

  const { pauseConnector } = usePauseConnector(
    connectorActionCallbacks('pause'),
  );
  const { resumeConnector } = useResumeConnector(
    connectorActionCallbacks('resume'),
  );
  const { restartConnector } = useRestartConnector(
    connectorActionCallbacks('restart'),
  );

  const connectors: ConnectorWithCapability[] = useMemo(() => {
    if (!connectorsQuery.data || !connectorsCapabilitiesQuery.data) return null;
    return connectorsQuery.data.map((c) => ({
      ...c,
      capabilities: connectorsCapabilitiesQuery.data.find(
        (capability) => capability.id === c.connectorId,
      ),
    }));
  }, [connectorsQuery.data, connectorsCapabilitiesQuery.data]);

  const columns: ColumnDef<ConnectorWithCapability>[] = getColumns({
    onDeleteClick: (connector: ConnectorWithCapability) =>
      navigate(`./delete/${connector.id}`),
    onEditClick: (connector: ConnectorWithCapability) =>
      navigate(`./edit/${connector.id}`),
    onTasksClick: (connector: ConnectorWithCapability) =>
      navigate(`./tasks/${connector.id}`),

    onPauseClick: (connector: ConnectorWithCapability) =>
      pauseConnector({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connectorId: connector.id,
      }),
    onStartClick: (connector: ConnectorWithCapability) =>
      resumeConnector({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connectorId: connector.id,
      }),
    onRestartClick: (connector: ConnectorWithCapability) =>
      restartConnector({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connectorId: connector.id,
      }),
  });

  const isDisabledIntegration =
    integrationsQuery.data &&
    !integrationsQuery.data?.some(
      (integration) =>
        integration.type === database.service.integration.TypeEnum.kafkaConnect,
    );

  if (isDisabledIntegration) {
    return (
      <>
        <h2>{t('title')}</h2>
        <Alert variant="warning">
          <AlertTitle>{t('noIntegrationTitle')}</AlertTitle>
          <AlertDescription>
            <p>{t('noIntegrationTitleDescription')}</p>
            <Link to="../integrations">
              {t('noIntegrationAddIntegrationLinkLabel')}
            </Link>
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <h2>{t('title')}</h2>

      {service.capabilities.connector?.create && (
        <Button
          mode="outline"
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.connector?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {connectors ? (
        <DataTable.Provider columns={columns} data={connectors} pageSize={25} />
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Connectors;
