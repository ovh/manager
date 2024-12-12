import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Description } from '@ovh-ux/manager-react-components';
import { getLogKindsQueryKey, useLogKinds } from './data/hooks/useLogKinds';
import { LogKind } from './data/types/dbaas/logs';
import { LogApiVersion } from './data/types/apiVersion';
import { LogsContext } from './LogsToCustomer.context';
import ApiError from './components/apiError/ApiError.component';
import './translations';

export type ApiUrls = {
  logKind: string;
  logSubscription: string;
  logUrl: string;
};

export interface ILogsToCustomerModule {
  logApiUrls: ApiUrls;
  logApiVersion: LogApiVersion;
}

export default function LogsToCustomerModule({
  logApiUrls,
  logApiVersion,
}: Readonly<ILogsToCustomerModule>) {
  const queryClient = useQueryClient();
  const [currentLogKind, setCurrentLogKind] = useState<LogKind>();
  const { t } = useTranslation('logKind');

  const { data: logKinds, error, isPending } = useLogKinds({
    logKindUrl: logApiUrls.logKind,
    apiVersion: logApiVersion,
  });

  useEffect(() => {
    if (!isPending && logKinds?.length > 0) setCurrentLogKind(logKinds[0]);
  }, [logKinds, isPending]);

  const LogsContextValues = useMemo(
    () => ({
      currentLogKind,
      logApiUrls,
      logApiVersion,
    }),
    [currentLogKind, logApiUrls, logApiVersion],
  );

  if (isPending)
    return (
      <div className="flex py-8">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logKinds-spinner"
        />
      </div>
    );

  if (error)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogKindsQueryKey(logApiUrls.logKind),
          })
        }
      />
    );

  if (logKinds.length === 0)
    return <Description>{t('log_kind_empty_state_description')}</Description>;

  if (!currentLogKind)
    return <Description>{t('log_kind_no_kind_selected')}</Description>;

  return (
    <div className="flex flex-col gap-8">
      {logKinds.length > 1 && (
        <div className="flex flex-col gap-4 ">
          <Description>{t('log_kind_selector_select_label')}</Description>
          <OsdsSelect
            value={currentLogKind?.kindId}
            onOdsValueChange={(event) => {
              const newLogKind = logKinds.find(
                (k) => k.kindId === event.detail.value,
              );
              if (newLogKind) setCurrentLogKind(newLogKind);
            }}
            data-testid={'logKindSelect'}
          >
            {logKinds.map((k) => (
              <OsdsSelectOption
                key={k.kindId}
                value={k.kindId}
                data-testid={'logKindOption'}
              >
                {k.displayName}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      )}
      <LogsContext.Provider value={LogsContextValues}>
        <Outlet />
      </LogsContext.Provider>
    </div>
  );
}
