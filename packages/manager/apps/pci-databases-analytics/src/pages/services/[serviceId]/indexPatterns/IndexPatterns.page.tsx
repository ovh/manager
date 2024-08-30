import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { Plus } from 'lucide-react';
import * as database from '@/types/cloud/project/database';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { useModale } from '@/hooks/useModale';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetIndexes } from '@/hooks/api/database/indexes/useGetIndexes.hook';
import { useGetPatterns } from '@/hooks/api/database/pattern/useGetPatterns.hook';
import { getPatternsColumns } from './_components/PatternsTableColumns.component';
import { getIndexesColumns } from './_components/IndexesTableColumns.component';
import DeleteIndexModal from './_components/DeleteIndex.component';
import DeletePatternModal from './_components/DeletePattern.component';
import AddPattern from './_components/AddPattern.component';

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
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const addPatternModale = useModale('addPattern');
  const deletePatternModale = useModale('deletePattern');
  const deleteIndexModale = useModale('deleteIndex');
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
      deletePatternModale.open(pattern.id),
  });

  const IndexesTableColumns: ColumnDef<
    database.opensearch.Index
  >[] = getIndexesColumns({
    onDeleteClick: (index: database.opensearch.Index) =>
      deleteIndexModale.open(index.id),
  });

  const patternToDelete: database.opensearch.Pattern = patternQuery.data?.find(
    (p) => p.id === deletePatternModale.value,
  );

  const indexToDelete: database.opensearch.Index = indexesQuery.data?.find(
    (i) => i.id === deleteIndexModale.value,
  );

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
          variant={'outline'}
          size="sm"
          className="text-base"
          onClick={() => addPatternModale.open()}
        >
          <Plus className="size-4 mr-2" />
          {t('addPatternButtonLabel')}
        </Button>
      )}
      {patternQuery.isSuccess ? (
        <DataTable
          columns={patternsTableColumns}
          data={patternQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="patterns-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      {patternQuery.isSuccess && (
        <AddPattern
          controller={addPatternModale.controller}
          // patterns={patternQuery.data}
          service={service}
          onSuccess={() => {
            addPatternModale.close();
            patternQuery.refetch();
          }}
        />
      )}

      {patternToDelete && (
        <DeletePatternModal
          controller={deletePatternModale.controller}
          service={service}
          pattern={patternToDelete}
          onSuccess={() => {
            deletePatternModale.close();
            patternQuery.refetch();
          }}
        />
      )}

      <h2>{t('titleIndexes')}</h2>
      {indexesQuery.isSuccess ? (
        <DataTable
          columns={IndexesTableColumns}
          data={indexesQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="indexes-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      {indexToDelete && (
        <DeleteIndexModal
          controller={deleteIndexModale.controller}
          service={service}
          index={indexToDelete}
          onSuccess={() => {
            deleteIndexModale.close();
            indexesQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default IndexPatterns;
