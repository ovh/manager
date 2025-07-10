import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '@/domain/enum/domainState.enum';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { TaskStatusEnum } from '@/domain/enum/taskStatus.enum';

export interface TNameServer {
  ipv4?: string | null;
  ipv6?: string | null;
  nameServer: string;
}

export interface TNameServerWithType extends TNameServer {
  nameServerType: keyof typeof DnsConfigurationTypeEnum;
}

export interface TDatagridDnsDetails {
  name: string;
  ip: string;
  status: string;
  type: keyof typeof PublicNameServerTypeEnum;
}

interface DNSConfiguration {
  configurationType: keyof typeof DnsConfigurationTypeEnum;
  glueRecordIPv6Supported: boolean;
  hostSupported: boolean;
  maxDNS: number;
  minDNS: number;
  nameServers: TNameServerWithType[];
  dnssecSupported: boolean;
}

interface Task {
  id: string; // UUID
  link: string;
  status: keyof typeof TaskStatusEnum;
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
    additionalStates: keyof typeof AdditionalDomainStateEnum[] | [];
    dnsConfiguration: DNSConfiguration;
    extension: string;
    mainState: keyof typeof DomainStateEnum;
    name: string;
    protectionState: keyof typeof ProtectionStateEnum;
    suspensionState: keyof typeof SuspensionStateEnum;
  };
  currentTasks: Task[];
  iam: IAMResource | null;
  id: string;
  resourceStatus: keyof typeof ResourceStatusEnum;
  targetSpec?: {
    dnsConfiguration?: {
      nameServers: TNameServer[];
    };
  };
}
