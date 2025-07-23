import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServer,
  TNameServerWithType,
} from '../types/domainResource';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import {
  ActiveConfigurationTypeEnum,
  DnsConfigurationTypeEnum,
} from '../enum/dnsConfigurationType.enum';
import { TDomainZone } from '../types/domainZone';

const INTERNAL_DNS_PATTERN: Record<string, RegExp> = {
  EU: /^d?ns(?:\d{1,3})?\.ovh\.net/i,
  CA: /d?ns\d{2}\.ovh\.ca/i,
  TN: /d?ns\d\.tn\.ovh\.net/i,
  REGISTRAR: /ns\d-registrar\.ovh\.net/i,
  ANYCAST: /d?ns\d{3}\.anycast\.me/i,
  PARKING: /parking\d\.ovh\.net/i,
  WORLD: /d?ns\d?(?:\.(?:\w{3}|\w{3}-\d))?\.(?:cdn|interne)\.ovh\.net/i,
  NG_GD: /d?ns\.ns-gd\.eu/i,
};

const DEDICATED_DNS_PATTERN: Record<string, RegExp> = {
  KIMSUFI: /ns\.kimsufi\.com/i,
  CA: /sdns\d\.ovh\.ca/i,
  EU: /sdns\d\.ovh\.net/i,
  US: /sdns\d\.ovh\.us/i,
};

function isInternalDns(value: string): boolean {
  return Object.values(INTERNAL_DNS_PATTERN).some((pattern) =>
    pattern.test(value),
  );
}

function isAnycastDns(value: string): boolean {
  return INTERNAL_DNS_PATTERN.ANYCAST.test(value);
}

function isDedicatedDns(value: string): boolean {
  return Object.values(DEDICATED_DNS_PATTERN).some((pattern) =>
    pattern.test(value),
  );
}

function guessNameserverType(
  dns: string,
): keyof typeof PublicNameServerTypeEnum {
  if (isAnycastDns(dns)) {
    return PublicNameServerTypeEnum.ANYCAST;
  }
  if (isDedicatedDns(dns)) {
    return PublicNameServerTypeEnum.DEDICATED;
  }
  if (isInternalDns(dns)) {
    return PublicNameServerTypeEnum.STANDARD;
  }
  return PublicNameServerTypeEnum.EXTERNAL;
}

export function isIncluded(
  list: TNameServer[] | TNameServerWithType[],
  search: TNameServer | TNameServerWithType,
): boolean {
  return list.some(
    (x) =>
      x.nameServer === search.nameServer &&
      x.ipv4 === search.ipv4 &&
      x.ipv6 === search.ipv6,
  );
}

export function transformCurrent(
  dns: TNameServerWithType,
  status: NameServerStatusEnum,
): TDatagridDnsDetails {
  let type: keyof typeof PublicNameServerTypeEnum;

  if (
    Object.values(PublicNameServerTypeEnum).includes(
      dns.nameServerType as PublicNameServerTypeEnum,
    )
  ) {
    type = dns.nameServerType as keyof typeof PublicNameServerTypeEnum;
  } else {
    type = PublicNameServerTypeEnum.STANDARD;
  }
  return {
    name: dns.nameServer,
    ip: dns.ipv4 || dns.ipv6 || '',
    status,
    type,
  };
}

export function transformTarget(
  dns: TNameServer,
  status: NameServerStatusEnum,
): TDatagridDnsDetails {
  return {
    name: dns.nameServer,
    ip: dns.ipv4 || dns.ipv6 || '',
    status,
    type: guessNameserverType(dns.nameServer),
  };
}

export function computeActiveConfiguration(
  domainResource: TDomainResource,
  domainZone?: TDomainZone,
): ActiveConfigurationTypeEnum {
  if (!domainZone) {
    return ActiveConfigurationTypeEnum.EXTERNAL;
  }

  const configType =
    domainResource?.currentState?.dnsConfiguration.configurationType;

  switch (configType) {
    case DnsConfigurationTypeEnum.MIXED:
      return ActiveConfigurationTypeEnum.MIXED;
    case DnsConfigurationTypeEnum.EXTERNAL:
      return ActiveConfigurationTypeEnum.EXTERNAL;
    default:
      return ActiveConfigurationTypeEnum.INTERNAL;
  }
}
