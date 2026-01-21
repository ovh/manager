import { ParamValueType } from '@ovh-ux/url-builder';
import { BADGE_COLOR, ICON_NAME } from '@ovhcloud/ods-react';
import { AxiosError } from 'axios';
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
import { AssociatedEmailsServicesEnum } from '../enum/associatedServices.enum';
import { THost, THostsconfiguration } from './host';
import { TDnssecConfiguration, TDsDataInterface } from './dnssecConfiguration';

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

export interface Task {
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
  currentState: TCurrentState;
  currentTasks: Task[];
  iam: IAMResource | null;
  id: string;
  resourceStatus: ResourceStatusEnum;
  targetSpec?: TTargetSpec;
}

export interface TCurrentState {
  additionalStates: AdditionalDomainStateEnum[] | [];
  authInfoManagedByOVHcloud: boolean;
  authInfoSupported: boolean;
  dnsConfiguration: DNSConfiguration;
  extension: string;
  mainState: DomainStateEnum;
  name: string;
  protectionState: ProtectionStateEnum;
  suspensionState: SuspensionStateEnum;
  contactsConfiguration: TContactsConfiguration;
  hostsConfiguration: THostsconfiguration;
  dnssecConfiguration: TDnssecConfiguration;
  createdAt: string;
}

export interface TTargetSpec {
  dnsConfiguration?: {
    nameServers: TNameServer[];
  };
  hostsConfiguration?: {
    hosts: THost[];
  };
  protectionState: ProtectionStateEnum;
  contactsConfiguration?: TContactsConfigurationTargetSpec;
  dnssecConfiguration?: {
    dsData: TDsDataInterface[];
  };
}

export interface TContactDisclosurePolicy {
  disclosureConfiguration: DisclosureConfigurationEnum;
  forcedDisclosureConfiguration: boolean;
  disclosedFields: string[];
  visibleViaRdds: boolean;
}

export interface TContactDetails {
  id: string;
  disclosurePolicy?: TContactDisclosurePolicy;
}

export interface TContactsConfiguration {
  contactOwner: TContactDetails;
  contactAdministrator: TContactDetails;
  contactTechnical: TContactDetails;
  contactBilling: TContactDetails;
}

export type TContactsConfigurationTargetSpec = {
  [key: string]: {
    disclosurePolicy?: {
      disclosureConfiguration: DisclosureConfigurationEnum;
    };
    id?: string;
  };
};

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
  icon?: ICON_NAME;
  value?: string;
};

export type ServiceType =
  | { serviceDetected: AssociatedEmailsServicesEnum.ZIMBRA; data: string }
  | { serviceDetected: AssociatedEmailsServicesEnum.MXPLAN; data: string }
  | { serviceDetected: AssociatedEmailsServicesEnum.REDIRECTION; data: string }
  | { serviceDetected: AssociatedEmailsServicesEnum.NOTHING; data: string };

export enum DnssecStateEnum {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  NOT_SUPPORTED = 'not_supported',
}

export enum NameServerTypeEnum {
  ANYCAST = 'anycast',
  DEDICATED = 'dedicated',
  EMPTY = 'empty',
  EXTERNAL = 'external',
  HOLD = 'hold',
  HOSTED = 'hosted',
  HOSTING = 'hosting',
  MIXED = 'mixed',
  PARKING = 'parking',
}

export enum OfferEnum {
  DIAMOND = 'diamond',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum IAMStateEnum {
  EXPIRED = 'EXPIRED',
  IN_CREATION = 'IN_CREATION',
  OK = 'OK',
  SUSPENDED = 'SUSPENDED',
}

export enum ParentServiceTypeEnum {
  ALL_DOM = '/allDom',
}

export enum RenewalStateEnum {
  AUTOMATIC_RENEW = 'automatic_renew',
  CANCELLATION_COMPLETE = 'cancellation_complete',
  CANCELLATION_REQUESTED = 'cancellation_requested',
  MANUAL_RENEW = 'manual_renew',
  UNPAID = 'unpaid',
}

export enum DomainServiceStateEnum {
  AUTORENEW_IN_PROGRESS = 'autorenew_in_progress',
  AUTORENEW_REGISTRY_IN_PROGRESS = 'autorenew_registry_in_progress',
  DELETED = 'deleted',
  DISPUTE = 'dispute',
  EXPIRED = 'expired',
  OK = 'ok',
  OUTGOING_TRANSFER = 'outgoing_transfer',
  PENDING_CREATE = 'pending_create',
  PENDING_DELETE = 'pending_delete',
  PENDING_INCOMING_TRANSFER = 'pending_incoming_transfer',
  PENDING_INSTALLATION = 'pending_installation',
  REGISTRY_SUSPENDED = 'registry_suspended',
  RESTORABLE = 'restorable',
  TECHNICAL_SUSPENDED = 'technical_suspended',
}

export enum TransferLockStatusEnum {
  LOCKED = 'locked',
  LOCKING = 'locking',
  UNAVAILABLE = 'unavailable',
  UNLOCKED = 'unlocked',
  UNLOCKING = 'unlocking',
}

export enum DisclosureConfigurationEnum {
  REDACTED = 'REDACTED',
  DISCLOSED = 'DISCLOSED',
}

export enum DataProtectionStatus {
  ACTIVE = 'active',
  PARTIAL = 'partial',
  NONE = 'none',
  DISABLED = 'disabled',
}

export enum DataProtectionFieldEnum {
  ADDRESS = 'ADDRESS',
  CITY = 'CITY',
  COUNTRY = 'COUNTRY',
  EMAIL = 'EMAIL',
  FAX = 'FAX',
  NAME = 'NAME',
  ORGANISATION = 'ORGANISATION',
  PHONE = 'PHONE',
  PROVINCE = 'PROVINCE',
  ZIP = 'ZIP',
}

export interface ContactData {
  id: string;
}

export interface IAM {
  displayName: string | null;
  id: string; // UUID
  state: IAMStateEnum | null;
  tags: Record<string, string> | null;
  urn: string;
}

export interface ParentService {
  name: string;
  type: ParentServiceTypeEnum;
}

export interface NameServer {
  id: number;
  ipv4: string | null;
  ipv6: string | null;
  nameServer: string;
  nameServerType: NameServerTypeEnum;
}

export type DomainService = {
  contactAdmin: ContactData;
  contactBilling: ContactData;
  contactOwner: ContactData;
  contactTech: ContactData;
  dnssecState: DnssecStateEnum;
  dnssecSupported: boolean;
  domain: string;
  expirationDate: string;
  glueRecordIpv6Supported: boolean;
  glueRecordMultiIpSupported: boolean;
  hostSupported: boolean;
  iam: IAM | null;
  lastUpdate: string;
  nameServerType?: NameServerTypeEnum;
  nameServers?: NameServer[];
  offer: OfferEnum;
  owoSupported: boolean;
  parentService: ParentService | null;
  renewalDate: string;
  renewalState: RenewalStateEnum;
  serviceId: number;
  state: DomainServiceStateEnum;
  suspensionState: SuspensionStateEnum;
  transferLockStatus?: TransferLockStatusEnum;
  whoisOwner: string;
};

export type TUpdateDomainVariables = {
  currentTargetSpec: TTargetSpec;
  updatedSpec: Partial<TTargetSpec>;
};

export type DomainUpdateApiError = AxiosError<{
  message: string;
}>;
