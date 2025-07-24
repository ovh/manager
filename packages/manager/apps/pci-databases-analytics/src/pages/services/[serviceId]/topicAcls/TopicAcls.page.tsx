import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { getColumns } from './_components/TopicAclsTableColumns.component';
import { useGetTopicAcls } from '@/hooks/api/database/topicAcl/useGetTopicAcls.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/topicAcl"
    />
  );
}

const TopicAcls = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topicAcls',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const topicAclsQuery = useGetTopicAcls(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.TOPIC_ACL,
    },
  );
  const columns: ColumnDef<database.kafka.TopicAcl>[] = getColumns({
    onDeleteClick: (topicAcl: database.kafka.TopicAcl) =>
      navigate(`./delete/${topicAcl.id}`),
  });
  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.topicAcl?.create && (
        <Button
          mode={'outline'}
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.topicAcl?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {topicAclsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={topicAclsQuery.data}
          pageSize={10}
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

export default TopicAcls;
