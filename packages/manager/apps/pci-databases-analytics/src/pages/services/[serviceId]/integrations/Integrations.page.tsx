import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import DataTable from '@/components/data-table';
import { POLLING } from '@/configuration/polling.constants';
import { getColumns } from './_components/IntegrationListColumns.component';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { GuideSections } from '@/types/guide';
import Guides from '@/components/guides/Guides.component';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/integrations"
    />
  );
}

export interface IntegrationWithServices extends database.service.Integration {
  source: database.Service;
  destination: database.Service;
}
const Integrations = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/integrations',
  );
  const { projectId, service } = useServiceData();
  const navigate = useNavigate();
  const { isUserActive } = useUserActivityContext();
  const servicesQuery = useGetServices(projectId, {
    refetchInterval: isUserActive && POLLING.INTEGRATIONS,
  });
  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.INTEGRATIONS,
    },
  );

  const isLoading = servicesQuery.isPending || integrationsQuery.isPending;

  const integrations: IntegrationWithServices[] = isLoading
    ? []
    : integrationsQuery.data.map((i) => ({
        ...i,
        source: servicesQuery.data.find((s) => s.id === i.sourceServiceId),
        destination: servicesQuery.data.find(
          (s) => s.id === i.destinationServiceId,
        ),
      }));

  const columns: ColumnDef<IntegrationWithServices>[] = getColumns({
    onDeleteClick: (integration: database.service.Integration) =>
      navigate(`./delete/${integration.id}`),
  });

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.integrations} engine={service.engine} />
      </div>
      {service.capabilities.integrations?.create && (
        <Button
          data-testid="integrations-add-button"
          mode={'outline'}
          size="sm"
          className="text-base"
          disabled={
            service.capabilities.integrations?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}
      {!isLoading ? (
        <DataTable.Provider
          columns={columns}
          data={integrations}
          pageSize={25}
        />
      ) : (
        <div data-testid="integrations-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Integrations;
