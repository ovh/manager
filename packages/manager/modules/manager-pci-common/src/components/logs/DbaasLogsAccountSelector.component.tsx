import React, { useEffect } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { TDbaasLog } from '../../api/data/dbaas-logs';
import { useDbaasLogs } from '../../api/hook/useLogs';

export interface DbaasLogsAccountSelectorProps {
  account: TDbaasLog;
  onAccountChange: (account: TDbaasLog) => void;
}

export function DbaasLogsAccountSelector({
  account,
  onAccountChange,
}: Readonly<DbaasLogsAccountSelectorProps>) {
  const { data: dbaasLogs, isPending } = useDbaasLogs();

  useEffect(() => {
    onAccountChange(dbaasLogs?.[0]);
  }, [dbaasLogs]);

  if (isPending)
    return (
      <div className="text-center">
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      </div>
    );

  return (
    <>
      {dbaasLogs?.length && (
        <div className="mt-8">
          <OsdsSelect
            className="w-[20rem]"
            value={account?.serviceName}
            onOdsValueChange={(event) =>
              onAccountChange(
                dbaasLogs.find(
                  ({ serviceName }) => serviceName === `${event.detail.value}`,
                ),
              )
            }
            inline
          >
            {dbaasLogs.map((log) => (
              <OsdsSelectOption value={log.serviceName} key={log.serviceName}>
                {log.displayName || log.serviceName}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      )}
    </>
  );
}
