import React, { useContext } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { LogsContext } from '../../LogsToCustomer.context';
import { getLogTailUrlQueryKey, useLogTailUrl } from '../../data/hooks/useLogTailUrl';
import ApiError from '../apiError/ApiError.component';
import { LogMessages } from './logMessages/LogMessages.component';
import './logTail.css';

export default function LogTail() {
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);
  const queryClient = useQueryClient();
  const { data, error, isPending } = useLogTailUrl({
    logTailUrl: logApiUrls.logUrl,
    logKind: currentLogKind?.name,
    apiVersion: logApiVersion,
  });

  if (isPending || error) {
    return (
      <div
        className={`h-[--tail-height] bg-slate-800 text-gray-200 flex items-center justify-center`}
      >
        {isPending && (
          <OdsSpinner data-testid="logTail-spinner" className=" [&::part(spinner)]:fill-white" />
        )}
        {error && (
          <ApiError
            testId="logTail-error"
            error={error}
            onRetry={() =>
              queryClient.refetchQueries({
                queryKey: getLogTailUrlQueryKey({
                  logKind: currentLogKind?.name,
                  logTailUrl: logApiUrls.logUrl,
                }),
              })
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className={`h-[--tail-height] bg-slate-800 text-slate-300`}>
      {<LogMessages logTailMessageUrl={data.url} />}
    </div>
  );
}
