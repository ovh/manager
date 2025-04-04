import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetIndexes } from '@/hooks/api/database/indexes/useGetIndexes.hook';
import { useGetPatterns } from '@/hooks/api/database/pattern/useGetPatterns.hook';
import { getPatternsColumns } from './_components/PatternsTableColumns.component';
import { getIndexesColumns } from './_components/IndexesTableColumns.component';
import DataTable from '@/components/data-table';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/indexPatterns"
    />
  );
}

const IndexPatterns = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const indexesQuery = useGetIndexes(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.INDEXES,
  });
  const patternQuery = useGetPatterns(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.PATTERNS,
  });

  const patternsTableColumns: ColumnDef<
    database.opensearch.Pattern
  >[] = getPatternsColumns({
    onDeleteClick: (pattern: database.opensearch.Pattern) =>
      navigate(`./delete-pattern/${pattern.id}`),
    service,
    t,
  });

  const IndexesTableColumns: ColumnDef<
    database.opensearch.Index
  >[] = getIndexesColumns({
    onDeleteClick: (index: database.opensearch.Index) =>
      navigate(`./delete-index/${index.id}`),
    service,
    t,
  });

  return (
    <>
      <h2>{t('titlePatterns')}</h2>
      {patternQuery.isSuccess && service.capabilities.patterns?.create && (
        <Button
          data-testid="pattern-add-button"
          disabled={
            service.capabilities.patterns?.create ===
            database.service.capability.StateEnum.disabled
          }
          mode={'outline'}
          size="sm"
          className="text-base"
          onClick={() => navigate('./add-pattern')}
        >
          <Plus className="size-4 mr-2" />
          {t('addPatternButtonLabel')}
        </Button>
      )}
      {patternQuery.isSuccess ? (
        <DataTable.Provider
          columns={patternsTableColumns}
          data={patternQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="patterns-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}

      <h2>{t('titleIndexes')}</h2>
      {indexesQuery.isSuccess ? (
        <DataTable.Provider
          columns={IndexesTableColumns}
          data={indexesQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="indexes-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}

      <Outlet />
    </>
  );
};

export default IndexPatterns;
