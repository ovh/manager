import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  useCancelCurrentQuery,
  useGetCurrentQueries,
} from '@/hooks/api/queries.api.hooks';
import { useServiceData } from '../../layout';
import { H3, P } from '@/components/typography';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { getColumns } from './currentQueriesTableColumns';
import { useToast } from '@/components/ui/use-toast';
import { POLLING } from '@/configuration/polling';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const CurrentQueries = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { projectId, service } = useServiceData();
  const [poll, setPoll] = useState(false);
  const [showIdle, setShowIdle] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const toast = useToast();
  const currentQueriesQuery = useGetCurrentQueries(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: poll ? POLLING.CURRENT_QUERIES : false,
    },
  );
  const { cancelCurrentQuery, isPending } = useCancelCurrentQuery({
    onError: (err) => {
      toast.toast({
        title: t('currentQueryTerminateToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
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
      <H3 className="mb-2">{t('currentQueriesTitle')}</H3>
      <P className="mb-2">{t('currentQueriesDescription')}</P>
      <div className="flex gap-4 mb-2">
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
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default CurrentQueries;
