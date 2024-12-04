import { LogProvider } from '@ovh-ux/manager-pci-common';

export interface KubeLogsProviderProps {
  kubeId: string;
  projectId: string;
}

export function KubeLogsProvider({
  children,
  kubeId,
  projectId,
}: React.PropsWithChildren<KubeLogsProviderProps>) {
  return (
    <LogProvider
      logsApiURL={`/cloud/project/${projectId}/kube/${kubeId}/log`}
      logsKeys={[
        'audit_verb',
        'audit_authorizationDecision',
        'audit_responseStatus',
        'audit_user',
        'audit_requestURI',
        'audit_groups',
        'audit_authorizationReason',
        'audit_userAgent',
        'audit_auditID',
      ]}
      logsKind="audit"
      logsGuideURL="https://google.com"
    >
      {children}
    </LogProvider>
  );
}
