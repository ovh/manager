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
import { useGetConnectorsCapabilities } from '@/data/hooks/database/connector/useGetConnectorsCapabilities.hook';
import { useGetConnectors } from '@/data/hooks/database/connector/useGetConnectors.hook';
import { usePauseConnector } from '@/data/hooks/database/connector/usePauseConnector.hook';
import { useResumeConnector } from '@/data/hooks/database/connector/useResumeConnector.hook';
import { useRestartConnector } from '@/data/hooks/database/connector/useRestartConnector.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { CdbError } from '@/data/api/database';
import { useGetIntegrations } from '@/data/hooks/database/integration/useGetIntegrations.hook';
import Link from '@/components/links/Link.component';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

export interface ConnectorWithCapability
  extends database.kafkaConnect.Connector {
  capabilities: database.kafkaConnect.capabilities.Connector;
}

const ListConnectors = () => {
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
        variant: 'critical',
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
        <Alert variant="warning" className="rounded-md flex flex-col gap-2">
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

      {connectors ? (
        <DataTable.Provider columns={columns} data={connectors} pageSize={25}>
          <DataTable.Header>
            {service.capabilities.connector?.create && (
              <DataTable.Action>
                <Button
                  mode="outline"
                  data-testid="add-button"
                  disabled={isCapabilityDisabled(
                    service,
                    'connector',
                    'create',
                  )}
                  onClick={() => navigate('./add')}
                >
                  <Plus className="w-4 h-4" />
                  {t('addButtonLabel')}
                </Button>
              </DataTable.Action>
            )}
          </DataTable.Header>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable.Provider>
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ListConnectors;
