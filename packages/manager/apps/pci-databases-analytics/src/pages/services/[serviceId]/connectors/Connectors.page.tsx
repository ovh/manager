import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { getColumns } from './_components/ConnectorsTableColumns.component';
import DataTable from '@/components/data-table';
import { useGetConnectorsCapabilities } from '@/hooks/api/database/connector/useGetConnectorsCapabilities.hook';
import { useGetConnectors } from '@/hooks/api/database/connector/useGetConnectors.hook';

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

  const connectorsListQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectorsQuery = useGetConnectors(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!connectorsListQuery.data?.length,
    },
  );

  const connectors: ConnectorWithCapability[] = useMemo(() => {
    if (!connectorsQuery.data || !connectorsListQuery.data) return [];
    return connectorsQuery.data.map((c) => ({
      ...c,
      capabilities: connectorsListQuery.data.find(
        (capability) => capability.id === c.connectorId,
      ),
    }));
  }, [connectorsQuery.data, connectorsListQuery.data]);

  const columns: ColumnDef<ConnectorWithCapability>[] = getColumns({
    onDeleteClick: (connector: ConnectorWithCapability) =>
      navigate(`./delete/${connector.id}`),
    onEditClick: (connector: ConnectorWithCapability) =>
      navigate(`./edit/${connector.id}`),
    onTasksClick: (connector: ConnectorWithCapability) =>
      navigate(`./tasks/${connector.id}`),

    onPauseClick: (connector: ConnectorWithCapability) =>
      console.log(`pausing ${connector.name}`),
    onStartClick: (connector: ConnectorWithCapability) =>
      console.log(`starting ${connector.name}`),
    onRestartClick: (connector: ConnectorWithCapability) =>
      console.log(`restarting ${connector.name}`),
  });

  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.connectors?.create && (
        <Button
          mode="outline"
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.connectors?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {connectorsQuery.isSuccess ? (
        <DataTable.Provider columns={columns} data={connectors} pageSize={25} />
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
    </>
  );
};

export default Connectors;
