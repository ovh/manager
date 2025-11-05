import React, { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSelect, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import './translations/error';
import './translations/logKind';
import './translations/logService';
import './translations/logSubscription';
import './translations/logStream';
import './translations/logStreams';
import './translations/logTail';
import { LogsContext } from './LogsToCustomer.context';
import { ApiUrls, LogIamActions } from './LogsToCustomer.props';
import ApiError from './components/apiError/ApiError.component';
import { getLogKindsQueryKey, useLogKinds } from './data/hooks/useLogKinds';
import { LogApiVersion } from './data/types/apiVersion';
import { LogKind } from './data/types/dbaas/logs';
import useLogTrackingActions from './hooks/useLogTrackingActions';
import { ZoomedInOutProvider } from './hooks/useZoomedInOut';
import { LogsActionEnum } from './types/logsTracking';
import { LogsToCustomerRoutes } from './routes/routes';

export interface ILogsToCustomerModule {
  logApiUrls: ApiUrls;
  logApiVersion: LogApiVersion;
  logIamActions: LogIamActions;
  resourceURN: string;
  trackingOptions?: {
    trackingSuffix: string;
  };
}

export function LogsToCustomerModule({
  logApiUrls,
  logApiVersion,
  logIamActions,
  resourceURN,
  trackingOptions,
}: Readonly<ILogsToCustomerModule>) {
  const queryClient = useQueryClient();
  const [currentLogKind, setCurrentLogKind] = useState<LogKind>();
  const { t } = useTranslation('logKind');
  const { trackClick } = useOvhTracking();
  const selectKindLogsAccess = useLogTrackingActions(
    LogsActionEnum.select_kind_logs_access,
  );
  const { data: logKinds, error, isPending } = useLogKinds({
    logKindUrl: logApiUrls.logKind,
    apiVersion: logApiVersion,
  });

  useEffect(() => {
    if (!isPending && logKinds && logKinds.length > 0)
      setCurrentLogKind(logKinds[0]);
  }, [logKinds, isPending]);

  const LogsContextValues = useMemo(
    () => ({
      currentLogKind,
      logApiUrls,
      logApiVersion,
      logIamActions,
      resourceURN,
      trackingOptions,
    }),
    [
      currentLogKind,
      logApiUrls,
      logApiVersion,
      logIamActions,
      resourceURN,
      trackingOptions,
    ],
  );

  if (isPending)
    return (
      <div className="flex py-8">
        <OdsSpinner size="md" data-testid="logKinds-spinner" />
      </div>
    );

  if (error)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          void queryClient.refetchQueries({
            queryKey: getLogKindsQueryKey(logApiUrls.logKind),
          })
        }
      />
    );

  if (logKinds.length === 0)
    return (
      <OdsText preset="paragraph">
        {t('log_kind_empty_state_description')}
      </OdsText>
    );

  if (!currentLogKind)
    return (
      <OdsText preset="paragraph">{t('log_kind_no_kind_selected')}</OdsText>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <OdsText preset="paragraph">
          {t('log_kind_selector_select_label')}
        </OdsText>
        <OdsSelect
          className="w-full md:w-96 "
          name="select-log-kind"
          isDisabled={logKinds.length === 1}
          value={currentLogKind?.kindId}
          onOdsChange={(event) => {
            const newLogKind = logKinds.find(
              (k) => k.kindId === event.detail.value,
            );
            if (newLogKind) {
              setCurrentLogKind(newLogKind);
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: [selectKindLogsAccess],
              });
            }
          }}
          data-testid={'logKindSelect'}
        >
          {logKinds.map((k) => (
            <option
              key={k.kindId}
              value={k.kindId}
              data-testid={'logKindOption'}
            >
              {k.displayName}
            </option>
          ))}
        </OdsSelect>
      </div>
      <LogsContext.Provider value={LogsContextValues}>
        <ZoomedInOutProvider>
          <LogsToCustomerRoutes />
        </ZoomedInOutProvider>
      </LogsContext.Provider>
    </div>
  );
}
