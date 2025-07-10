type DomainState =
  | 'DELETED'
  | 'EXPIRED'
  | 'OK'
  | 'PENDING_CREATE'
  | 'PENDING_DELETE'
  | 'PENDING_INTERNAL_TRANSFER'
  | 'PENDING_OUTGOING_TRANSFER'
  | 'RESTORABLE'
  | 'TO_DELETE';

type AdditionalDomainState = 'DISPUTE' | 'TECHNICAL_SUSPENDED';

type DnsConfigurationType =
  | 'ANYCAST'
  | 'DEDICATED'
  | 'EMPTY'
  | 'EXTERNAL'
  | 'HOLD'
  | 'HOSTING'
  | 'MIXED'
  | 'PARKING';

type ProtectionState = 'PROTECTED' | 'UNPROTECTED';

type SuspensionState = 'NOT_SUSPENDED' | 'SUSPENDED';

type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED';

type ResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

export interface TNameServer {
  ipv4?: string | null;
  ipv6?: string | null;
  nameServer: string;
}

export interface TNameServerWithType extends TNameServer {
  nameServerType: DnsConfigurationType;
}

export interface TDatagridDnsDetails {
  name: string;
  ip: string;
  status: string;
  type: DnsConfigurationType;
}

interface DNSConfiguration {
  configurationType: DnsConfigurationType;
  glueRecordIPv6Supported: boolean;
  hostSupported: boolean;
  maxDNS: number;
  minDNS: number;
  nameServers: TNameServerWithType[];
}

interface Task {
  id: string; // UUID
  link: string;
  status: TaskStatus;
  type: string;
}

interface IAMResource {
  displayName?: string | null;
  id: string; // UUID
  tags: Record<string, string> | null;
  urn: string;
}

export interface TDomainResource {
  checksum: string;
  currentState: {
    additionalStates: AdditionalDomainState[];
    dnsConfiguration: DNSConfiguration;
    extension: string;
    mainState: DomainState;
    name: string;
    protectionState: ProtectionState;
    suspensionState: SuspensionState;
  };
  currentTasks: Task[];
  iam: IAMResource | null;
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec?: {
    dnsConfiguration?: {
      nameServers: TNameServer[];
    };
  };
}
