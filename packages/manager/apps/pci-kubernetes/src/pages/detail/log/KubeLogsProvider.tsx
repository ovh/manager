import { PropsWithChildren } from 'react';

import { LogProvider } from '@ovh-ux/manager-pci-common';
import { useMe } from '@ovh-ux/manager-react-components';

import { DATA_PLATFORM_GUIDE, LOG_LIST_TRACKING_HITS, LOG_TRACKING_HITS } from './constants';

export interface KubeLogsProviderProps {
  kubeId: string;
  projectId: string;
}

export function KubeLogsProvider({
  children,
  kubeId,
  projectId,
}: PropsWithChildren<KubeLogsProviderProps>) {
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  return (
    <LogProvider
      logsApiURL={`/cloud/project/${projectId}/kube/${kubeId}/log`}
      logsKeys={['message']}
      logsKind="audit"
      logsGuideURL={
        DATA_PLATFORM_GUIDE[ovhSubsidiary as keyof typeof DATA_PLATFORM_GUIDE] ||
        DATA_PLATFORM_GUIDE.DEFAULT
      }
      logsTracking={{
        graylogWatch: LOG_TRACKING_HITS.GRAYLOG_WATCH,
        ldpDetails: LOG_LIST_TRACKING_HITS.LDP_DETAIL,
        subscribe: LOG_LIST_TRACKING_HITS.SUBSCRIBE,
        unsubscribe: LOG_LIST_TRACKING_HITS.UNSUBSCRIBE,
        createAccount: LOG_TRACKING_HITS.CREATE_ACCOUNT,
        createDataStream: LOG_TRACKING_HITS.CREATE_DATA_STREAM,
        transfer: LOG_TRACKING_HITS.TRANSFER,
      }}
    >
      {children}
    </LogProvider>
  );
}
