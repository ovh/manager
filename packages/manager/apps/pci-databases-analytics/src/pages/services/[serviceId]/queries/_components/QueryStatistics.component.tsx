import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { useServiceData } from '../../Service.context';
import { DataTable } from '@/components/ui/data-table';
import * as database from '@/types/cloud/project/database';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getColumns } from './QueryStatisticsTableColumns.component';
import { useGetQueryStatistics } from '@/hooks/api/database/query/useGetQueryStatistics.hook';
import { useResetQueryStatistics } from '@/hooks/api/database/query/useResetQueryStatistics.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

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
        variant: 'destructive',
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

  const columns: ColumnDef<
    database.postgresql.querystatistics.Query
  >[] = getColumns();
  return (
    <>
      <h3>{t('queryStatisticsTitle')}</h3>
      <p data-testid="query-statistics-description">
        {t('queryStatisticsDescription')}
      </p>
      {service.capabilities.queryStatisticsReset && (
        <Button
          data-testid="query-statistics-reset-button"
          variant="outline"
          size="sm"
          onClick={() => handleResetButtonClicked()}
          disabled={
            isPending ||
            service.capabilities.queryStatisticsReset.create ===
              database.service.capability.StateEnum.disabled
          }
        >
          <RotateCcw className="size-4 mr-2" />
          {t('queryStatisticsResetButton')}
        </Button>
      )}
      {queryStatisticsQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={
            queryStatisticsQuery.data as database.postgresql.querystatistics.Query[]
          }
          pageSize={25}
        />
      ) : (
        <div data-testid="query-statistics-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
    </>
  );
};

export default QueryStatistics;
