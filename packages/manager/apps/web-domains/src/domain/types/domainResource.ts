import { ParamValueType } from '@ovh-ux/url-builder';
import { BADGE_COLOR } from '@ovhcloud/ods-react';
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
import { OptionStateEnum } from '../enum/optionState.enum';
import { OptionEnum } from '../../common/enum/option.enum';

export interface TNameServer {
  ipv4?: string | null;
  ipv6?: string | null;
  nameServer: string;
}

export interface TNameServerWithType extends TNameServer {
  nameServerType: DnsConfigurationTypeEnum;
}

export interface TDatagridDnsDetails {
  name: string;
  ip: string;
  status: string;
  type: PublicNameServerTypeEnum;
}

export interface DNSConfiguration {
  configurationType: DnsConfigurationTypeEnum;
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
  status: TaskStatusEnum;
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
    additionalStates: AdditionalDomainStateEnum[] | [];
    dnsConfiguration: DNSConfiguration;
    extension: string;
    mainState: DomainStateEnum;
    name: string;
    protectionState: ProtectionStateEnum;
    suspensionState: SuspensionStateEnum;
  };
  currentTasks: Task[];
  iam: IAMResource | null;
  id: string;
  resourceStatus: ResourceStatusEnum;
  targetSpec?: {
    dnsConfiguration?: {
      nameServers: TNameServer[];
    };
    protectionState: ProtectionStateEnum;
  };
}

export interface TDomainOption {
  option: OptionEnum;
  expirationDate: string;
  state: OptionStateEnum;
}

export type ComboRule = {
  requiresAll: string[];
  result: BannerResultDetails;
};
export type BannerType = 'error' | 'warning';
export type BannerResult = BannerResultDetails | undefined;
export type BannerResultDetails = {
  type: BannerType;
  i18nKey: string;
  link?: {
    linkDetails?: [string, string, Record<string, ParamValueType>];
    linki18n: string;
    orderFunnel?: boolean;
  };
};

export type StatusDetails = {
  statusColor: BADGE_COLOR;
  i18nKey: string;
};
