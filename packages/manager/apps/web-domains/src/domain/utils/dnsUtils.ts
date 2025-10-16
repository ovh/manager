import {
  DNSConfiguration,
  TDatagridDnsDetails,
  TDomainResource,
  TNameServer,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import {
  ActiveConfigurationTypeEnum,
  DnsConfigurationTypeEnum,
} from '@/domain/enum/dnsConfigurationType.enum';
import { TDomainZone } from '@/domain/types/domainZone';

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

export function isInternalDns(value: string): boolean {
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

function guessNameserverType(dns: string): PublicNameServerTypeEnum {
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
  status: StatusEnum,
): TDatagridDnsDetails {
  let type: PublicNameServerTypeEnum;

  if (
    Object.values(PublicNameServerTypeEnum).includes(
      PublicNameServerTypeEnum[
        dns.nameServerType as keyof typeof PublicNameServerTypeEnum
      ],
    )
  ) {
    type =
      PublicNameServerTypeEnum[
        dns.nameServerType as keyof typeof PublicNameServerTypeEnum
      ];
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
  status: StatusEnum,
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

export function computeDisplayNameServers(
  currentStateConfig: DNSConfiguration,
  domainZone: TDomainZone,
  selectedConfig: ActiveConfigurationTypeEnum,
): TNameServer[] {
  const isSameConfig =
    selectedConfig ===
    ((currentStateConfig.configurationType as unknown) as ActiveConfigurationTypeEnum);

  if (selectedConfig === ActiveConfigurationTypeEnum.EXTERNAL && isSameConfig) {
    return currentStateConfig.nameServers as TNameServer[];
  }

  if (selectedConfig === ActiveConfigurationTypeEnum.MIXED) {
    if (!isSameConfig) {
      return domainZone.nameServers.map((ns) => ({ nameServer: ns }));
    }
    const sortedNameServers = [
      ...currentStateConfig.nameServers.filter((ns) =>
        domainZone.nameServers.includes(ns.nameServer),
      ),
      ...currentStateConfig.nameServers.filter(
        (ns) => !domainZone.nameServers.includes(ns.nameServer),
      ),
    ];
    return sortedNameServers.map(({ nameServer, ipv4, ipv6 }) => ({
      nameServer,
      ipv4,
      ipv6,
    }));
  }
  return [];
}

export function canSaveNewDnsConfig(
  initialServers: TNameServer[],
  newServers: TNameServer[],
  dnsConfig: DNSConfiguration,
): boolean {
  const areServersEqual = (a: TNameServer, b: TNameServer): boolean => {
    return (
      a.nameServer === b.nameServer &&
      (a.ipv4 ?? null) === (b.ipv4 ?? null) &&
      (a.ipv6 ?? null) === (b.ipv6 ?? null)
    );
  };

  const areArraysDifferent = (): boolean => {
    if (initialServers.length !== newServers.length) return true;
    const unmatched = [...newServers];
    return initialServers.some((initial) => {
      const idx = unmatched.findIndex((ns) => areServersEqual(initial, ns));
      if (idx === -1) return true;
      unmatched.splice(idx, 1);
      return false;
    });
  };

  const count = newServers.length;
  return (
    count >= dnsConfig.minDNS &&
    count <= dnsConfig.maxDNS &&
    areArraysDifferent()
  );
}
