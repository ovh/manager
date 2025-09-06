import { createContext } from 'react';

import { ApiUrls, LogIamActions } from './LogsToCustomer.module';
import { LogApiVersion } from './data/types/apiVersion';
import { LogKind } from './data/types/dbaas/logs';

export interface LogProviderProps {
  currentLogKind?: LogKind;
  logApiUrls: Pick<ApiUrls, 'logSubscription' | 'logUrl'>;
  logApiVersion: LogApiVersion;
  logIamActions?: LogIamActions;
  resourceURN?: string;
  trackingOptions?: {
    trackingSuffix: string;
  };
}

export const LogsContext = createContext<LogProviderProps>({
  logApiUrls: {
    logSubscription: '',
    logUrl: '',
  },
  logApiVersion: 'v2',
  trackingOptions: undefined,
});
