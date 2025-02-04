import { createContext } from 'react';
import { LogKind } from './data/types/dbaas/logs';
import { ApiUrls, LogIamActions } from './LogsToCustomer.module';
import { LogApiVersion } from './data/types/apiVersion';
import { LogsActionName } from './types/logsTracking';

export interface LogProviderProps {
  currentLogKind?: LogKind;
  logApiUrls: Pick<ApiUrls, 'logSubscription' | 'logUrl'>;
  logApiVersion: LogApiVersion;
  logIamActions?: LogIamActions;
  resourceURN?: string;
  trackingOptions?: {
    trackClickMap: Record<LogsActionName, string[]>;
  };
}

export const LogsContext = createContext<LogProviderProps>({
  logApiUrls: {
    logSubscription: '',
    logUrl: '',
  },
  logApiVersion: 'v2',
  trackingOptions: null,
});
