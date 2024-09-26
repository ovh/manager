import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useServiceData } from '../../Service.context';
import { DataTable } from '@/components/ui/data-table';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './CurrentQueriesTableColumns.component';
import { useToast } from '@/components/ui/use-toast';
import { POLLING } from '@/configuration/polling.constants';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetCurrentQueries } from '@/hooks/api/database/query/useGetCurrentQueries.hook';
import { useCancelCurrentQuery } from '@/hooks/api/database/query/useCancelCurrentQuery.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

const CurrentQueries = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const [poll, setPoll] = useState(false);
  const [showIdle, setShowIdle] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const toast = useToast();
  const currentQueriesQuery = useGetCurrentQueries(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && poll && POLLING.CURRENT_QUERIES,
    },
  );
  const { cancelCurrentQuery } = useCancelCurrentQuery({
    onError: (err) => {
      toast.toast({
        title: t('currentQueryTerminateToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (result) => {
      currentQueriesQuery.refetch();
      if (result.success) {
        toast.toast({
          title: t('currentQueryTerminateToastSuccesTitle'),
        });
      } else {
        toast.toast({
          variant: 'destructive',
          title: t('currentQueryTerminateToastSuccesFalseTitle'),
        });
      }
    },
  });
  const columns: ColumnDef<
    database.service.currentqueries.Query
  >[] = getColumns({
    onCancelQueryClicked: (query) => {
      cancelCurrentQuery({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        pid: query.pid,
        terminate: true,
      });
    },
  });

  const shouldHideQuery = (
    query: database.service.currentqueries.Query,
  ): boolean => {
    const queryState = database.service.currentqueries.StateEnum;
    if (
      !showIdle &&
      [
        queryState.IDLE,
        queryState.IDLE_IN_TRANSACTION,
        queryState.IDLE_IN_TRANSACTION_ABORTED,
      ].includes(query.state)
    ) {
      return true;
    }
    if (!showActive && [queryState.ACTIVE].includes(query.state)) {
      return true;
    }
    return false;
  };
  const filteredQueries =
    currentQueriesQuery.data?.filter((q) => !shouldHideQuery(q)) || [];

  return (
    <>
      <h3>{t('currentQueriesTitle')}</h3>
      <p>{t('currentQueriesDescription')}</p>
      <div data-testid="current-queries-container" className="flex gap-4">
        <div className="flex items-center space-x-2 ">
          <Switch
            className="rounded-xl"
            id="poll-current-queries"
            checked={showIdle}
            onCheckedChange={(checked: boolean) => setShowIdle(checked)}
          />
          <Label htmlFor="poll-logs">
            {t('currentQueriesShowIdleConnections')}
          </Label>
        </div>
        <div className="flex items-center space-x-2 ">
          <Switch
            className="rounded-xl"
            id="poll-current-queries"
            checked={showActive}
            onCheckedChange={(checked: boolean) => setShowActive(checked)}
          />
          <Label htmlFor="poll-logs">
            {t('currentQueriesShowActiveConnections')}
          </Label>
        </div>
        <div className="flex items-center space-x-2 ">
          <Switch
            className="rounded-xl"
            id="poll-current-queries"
            checked={poll}
            onCheckedChange={(checked: boolean) => setPoll(checked)}
          />
          <Label htmlFor="poll-logs">{t('currentQueriesAutoRefresh')}</Label>
        </div>
      </div>
      {currentQueriesQuery.isSuccess ? (
        <DataTable columns={columns} data={filteredQueries} pageSize={25} />
      ) : (
        <div data-testid="current-queries-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
    </>
  );
};

export default CurrentQueries;
