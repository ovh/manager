import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetIndexes } from '@/data/hooks/database/indexes/useGetIndexes.hook';
import { useGetPatterns } from '@/data/hooks/database/pattern/useGetPatterns.hook';
import { getPatternsColumns } from './_components/PatternsTableColumns.component';
import { getIndexesColumns } from './_components/IndexesTableColumns.component';
import DataTable from '@/components/data-table';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/indexPatterns"
    />
  );
}

const ListIndexPatterns = () => {
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
      {patternQuery.isSuccess ? (
        <DataTable.Provider
          columns={patternsTableColumns}
          data={patternQuery.data}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.patterns?.create && (
              <DataTable.Action>
                <Button
                  data-testid="pattern-add-button"
                  disabled={isCapabilityDisabled(service, 'patterns', 'create')}
                  mode="outline"
                  onClick={() => navigate('./add-pattern')}
                >
                  <Plus className="size-4" />
                  {t('addPatternButtonLabel')}
                </Button>
              </DataTable.Action>
            )}
          </DataTable.Header>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable.Provider>
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

export default ListIndexPatterns;
