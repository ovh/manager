import React, { createContext } from 'react';

export interface LogProviderProps {
  logsApiURL: string;
  logsKeys: string[];
  logsKind: string;
  logsGuideURL?: string;
  logsTracking?: {
    graylogWatch?: string;
    ldpDetails?: string;
    subscribe?: string;
    unsubscribe?: string;
    createAccount?: string;
    createDataStream?: string;
    transfer?: string;
  };
}

export const LogContext = createContext<LogProviderProps>({
  logsApiURL: '',
  logsKeys: [],
  logsKind: '',
});

export function LogProvider({
  logsApiURL,
  logsKeys,
  logsKind,
  logsGuideURL,
  children,
}: React.PropsWithChildren<LogProviderProps>) {
  return (
    <LogContext.Provider
      value={{ logsApiURL, logsKeys, logsKind, logsGuideURL }}
    >
      {children}
    </LogContext.Provider>
  );
}
