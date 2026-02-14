import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import DataTable from '@/components/data-table';
import { getColumns } from './_components/TopicsTableColumns.component';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { POLLING } from '@/configuration/polling.constants';
import { useGetTopics } from '@/data/hooks/database/topic/useGetTopics.hook';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/topics"
    />
  );
}

const ListTopics = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topics',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const topicsQuery = useGetTopics(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.DATABASES,
  });
  const columns: ColumnDef<database.kafka.Topic>[] = getColumns({
    onDeleteClick: (topic: database.kafka.Topic) =>
      navigate(`./delete/${topic.id}`),
    onEditClick: (topic: database.kafka.Topic) =>
      navigate(`./edit/${topic.id}`),
  });

  return (
    <>
      <h2>{t('title')}</h2>
      {topicsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={topicsQuery.data}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.topic?.create && (
              <DataTable.Action>
                <Button
                  mode="outline"
                  data-testid="add-button"
                  disabled={isCapabilityDisabled(service, 'topic', 'create')}
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

export default ListTopics;
