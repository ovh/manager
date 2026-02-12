import React, { useContext } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { Spinner } from '@ovhcloud/ods-react';

import { LogsContext } from '@/LogsToCustomer.context';
import ApiError from '@/components/api-error/ApiError.component';
import { LogMessages } from '@/components/log-tail/log-messages/LogMessages.component';
import { getLogTailUrlQueryKey, useLogTailUrl } from '@/data/hooks/useLogTailUrl';

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
        className={`h-[var(--tail-height)] bg-slate-800 text-gray-200 flex items-center justify-center`}
      >
        {isPending && <Spinner data-testid="logTail-spinner" className="fill-white" />}
        {error && (
          <ApiError
            testId="logTail-error"
            error={error}
            onRetry={() => {
              void queryClient.refetchQueries({
                queryKey: getLogTailUrlQueryKey({
                  logKind: currentLogKind?.name,
                  logTailUrl: logApiUrls.logUrl,
                }),
              });
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`h-[var(--tail-height)] bg-slate-800 text-slate-300`}>
      {<LogMessages logTailMessageUrl={data.url} />}
    </div>
  );
}
