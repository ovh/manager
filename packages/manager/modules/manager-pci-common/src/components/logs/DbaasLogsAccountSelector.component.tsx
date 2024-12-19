import { useEffect } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSelect, OdsSpinner } from '@ovhcloud/ods-components/react';
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
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
    );

  return (
    <>
      {dbaasLogs?.length && (
        <div className="mt-8">
          <OdsSelect
            name="select-serviceName"
            className="w-[20rem]"
            value={account?.serviceName}
            onOdsChange={(event) =>
              onAccountChange(
                dbaasLogs.find(
                  ({ serviceName }) => serviceName === `${event.detail.value}`,
                ),
              )
            }
          >
            {dbaasLogs.map((log) => (
              <option value={log.serviceName} key={log.serviceName}>
                {log.displayName || log.serviceName}
              </option>
            ))}
          </OdsSelect>
        </div>
      )}
    </>
  );
}
