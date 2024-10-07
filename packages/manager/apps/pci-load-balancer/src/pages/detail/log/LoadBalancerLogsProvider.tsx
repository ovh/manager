import { LogProvider } from '@ovh-ux/manager-pci-common';
import { useMe } from '@ovh-ux/manager-react-components';
import { LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK } from '@/constants';

export interface KubeLogsProviderProps {
  loadBalancerId: string;
  projectId: string;
  region: string;
}

export function LoadBalancerLogsProvider({
  children,
  loadBalancerId,
  projectId,
  region,
}: React.PropsWithChildren<KubeLogsProviderProps>) {
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  return (
    <LogProvider
      logsApiURL={`/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadBalancerId}/log`}
      logsKeys={[
        'client_ip',
        'http_verb',
        'http_request',
        'http_version_num',
        'http_status_int',
        'bytes_uploaded_int',
      ]}
      logsKind="haproxy"
      logsGuideURL={
        LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK[ovhSubsidiary] ||
        LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK.DEFAULT
      }
      logsTracking={
        {
          // @TODO wait for implementation
          // graylogWatch: '',
          // ldpDetails: '',
          // subscribe: '',
          // unsubscribe: '',
          // createAccount: '',
          // createDataStream: '',
          // transfer: '',
        }
      }
    >
      {children}
    </LogProvider>
  );
}
