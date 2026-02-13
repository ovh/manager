import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle, Button } from '@datatr-ux/uxlib';
import { useMemo } from 'react';
import * as database from '@/types/cloud/project/database';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import { getColumns } from './_components/ReplicationsTableColumns.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import DataTable from '@/components/data-table';
import { useGetReplications } from '@/data/hooks/database/replication/useGetReplications.hook';
import { useGetServices } from '@/data/hooks/database/service/useGetServices.hook';
import { useGetIntegrations } from '@/data/hooks/database/integration/useGetIntegrations.hook';
import Link from '@/components/links/Link.component';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/replications"
    />
  );
}

export interface ReplicationWithServiceData
  extends database.service.Replication {
  sourceIntegrationService?: database.Service;
  targetIntegrationService: database.Service;
}

const ListReplications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/replications',
  );
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const replicationsQuery = useGetReplications(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.REPLICATIONS,
    },
  );
  const servicesQuery = useGetServices(projectId, {
    refetchInterval: isUserActive && POLLING.SERVICES,
  });

  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.INTEGRATIONS,
    },
  );

  const replicationsWithServiceData: ReplicationWithServiceData[] = useMemo(
    () =>
      replicationsQuery.data?.map((replication) => ({
        ...replication,
        sourceIntegrationService: servicesQuery.data?.find(
          (s) =>
            integrationsQuery.data?.find(
              (i) => i.id === replication.sourceIntegration,
            ).sourceServiceId === s.id,
        ),
        targetIntegrationService: servicesQuery.data?.find(
          (s) =>
            integrationsQuery.data?.find(
              (i) => i.id === replication.targetIntegration,
            ).sourceServiceId === s.id,
        ),
      })),
    [replicationsQuery.data, servicesQuery.data, integrationsQuery.data],
  );

  const columns: ColumnDef<ReplicationWithServiceData>[] = getColumns({
    onEditClick: (replication: ReplicationWithServiceData) =>
      navigate(`./edit/${replication.id}`),
    onDeleteClick: (replication: ReplicationWithServiceData) =>
      navigate(`./delete/${replication.id}`),
  });

  const isDisabledIntegration =
    integrationsQuery.data &&
    integrationsQuery.data?.filter(
      (integration) =>
        integration.type ===
        database.service.integration.TypeEnum.kafkaMirrorMaker,
    ).length < 2;
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
      {replicationsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={replicationsWithServiceData}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.replication?.create && (
              <DataTable.Action>
                <Button
                  data-testid="replications-add-button"
                  disabled={isCapabilityDisabled(
                    service,
                    'replication',
                    'create',
                  )}
                  mode="outline"
                  onClick={() => navigate('./add')}
                >
                  <Plus className="size-4" />
                  {t('addButtonLabel')}
                </Button>
              </DataTable.Action>
            )}
          </DataTable.Header>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable.Provider>
      ) : (
        <div data-testid="replications-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ListReplications;
