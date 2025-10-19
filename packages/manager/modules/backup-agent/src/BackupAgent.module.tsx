import React, { useMemo } from 'react';

import { Outlet } from 'react-router-dom';

import { BackupAgentScope, BackupAgentContext } from './BackupAgent.context';
import './translations';

export type BackupAgentModule = {
  appName: string,
  scope: BackupAgentScope
}



export function BackupAgentModule(backupAgentOptions: Readonly<BackupAgentModule>) {
  const BackupAgentContextValues = useMemo(
    () => (backupAgentOptions),
    [backupAgentOptions],
  );

  // if (isPending)
  //   return (
  //     <div className="flex py-8">
  //       <OdsSpinner size="md" data-testid="logKinds-spinner" />
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <ApiError
  //       testId="logKinds-error"
  //       error={error}
  //       onRetry={() =>
  //         void queryClient.refetchQueries({
  //           queryKey: getLogKindsQueryKey(logApiUrls.logKind),
  //         })
  //       }
  //     />
  //   );

  // if (logKinds.length === 0)
  //   return <OdsText preset="paragraph">{t('log_kind_empty_state_description')}</OdsText>;

  return (
      <BackupAgentContext.Provider value={BackupAgentContextValues}>
          <Outlet />
      </BackupAgentContext.Provider>
  );
}
