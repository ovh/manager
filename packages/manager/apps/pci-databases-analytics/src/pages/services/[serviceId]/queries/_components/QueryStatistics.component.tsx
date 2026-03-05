import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import DataTable from '@/components/data-table';
import { useGetQueryStatistics } from '@/data/hooks/database/query/useGetQueryStatistics.hook';
import { useResetQueryStatistics } from '@/data/hooks/database/query/useResetQueryStatistics.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { getColumns } from './QueryStatisticsTableColumns.component';
import { QueryStatistics as QueryStatisticsType } from '@/data/api/database/queries.api';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

const QueryStatistics = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { projectId, service } = useServiceData();
  const toast = useToast();
  const queryStatisticsQuery = useGetQueryStatistics(
    projectId,
    service.engine,
    service.id,
  );
  const { resetQueryStatistics, isPending } = useResetQueryStatistics({
    onError: (err) => {
      toast.toast({
        title: t('queryStatistcsResetToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      queryStatisticsQuery.refetch();
      toast.toast({
        title: t('queryStatistcsResetToastSuccesTitle'),
      });
    },
  });

  const handleResetButtonClicked = () => {
    resetQueryStatistics({
      projectId,
      engine: service.engine,
      serviceId: service.id,
    });
  };

  const columns = getColumns(service.engine) as ColumnDef<
    QueryStatisticsType
  >[];
  return (
    <>
      <h3>{t('queryStatisticsTitle')}</h3>
      <p data-testid="query-statistics-description">
        {t('queryStatisticsDescription')}
      </p>
      {queryStatisticsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={queryStatisticsQuery.data as QueryStatisticsType[]}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.queryStatisticsReset && (
              <DataTable.Action>
                <Button
                  data-testid="query-statistics-reset-button"
                  mode="outline"
                  onClick={() => handleResetButtonClicked()}
                  disabled={
                    isPending ||
                    isCapabilityDisabled(
                      service,
                      'queryStatisticsReset',
                      'create',
                    )
                  }
                >
                  <RotateCcw className="size-4" />
                  {t('queryStatisticsResetButton')}
                </Button>
              </DataTable.Action>
            )}
          </DataTable.Header>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable.Provider>
      ) : (
        <div data-testid="query-statistics-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
    </>
  );
};

export default QueryStatistics;
