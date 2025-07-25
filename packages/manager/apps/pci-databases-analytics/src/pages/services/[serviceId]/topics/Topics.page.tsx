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
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetTopics } from '@/hooks/api/database/topic/useGetTopics.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/topics"
    />
  );
}

const Topics = () => {
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
      {service.capabilities.topic?.create && (
        <Button
          mode="outline"
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.topic?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {topicsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={topicsQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Topics;
