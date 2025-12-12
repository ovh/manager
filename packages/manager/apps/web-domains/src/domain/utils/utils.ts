import { z } from 'zod/v4';
import { GUIDES_LIST, LangCode } from '@/domain/constants/guideLinks';
import {
  TDatagridDnsDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import {
  isIncluded,
  transformCurrent,
  transformTarget,
} from '@/domain/utils/dnsUtils';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { DNS_UPDATE_OPERATION } from '../constants/dns.const';
import { FreeHostingOptions } from '../components/AssociatedServicesCards/Hosting';
import { IpsSupportedEnum } from '../enum/hostConfiguration.enum';
import { THost } from '../types/host';
import { TDsDataInterface } from '../types/dnssecConfiguration';
import { algorithm_RSASHZA3457 } from '../constants/dsRecords';

export function getLanguageKey(lang: string): LangCode {
  const code = lang.split(/[-_]/)[0].toUpperCase();
  const isSupported = code in GUIDES_LIST.domains.url;

  return isSupported ? (code as LangCode) : 'DEFAULT';
}

export function computeDnsDetails(
  domainResource: TDomainResource,
): TDatagridDnsDetails[] {
  const current = domainResource.currentState.dnsConfiguration.nameServers;
  const target = domainResource.targetSpec.dnsConfiguration.nameServers;
  const updateIsInError = domainResource.currentTasks.find(
    (task) =>
      task.type === DNS_UPDATE_OPERATION &&
      task.status.toLowerCase() === StatusEnum.ERROR.toLowerCase(),
  );

  const activated = current
    .filter((dns) => isIncluded(target, dns))
    .map((dns) => transformCurrent(dns, StatusEnum.ENABLED));

  const activating = target
    .filter((dns) => !isIncluded(current, dns))
    .map((dns) => {
      if (updateIsInError) {
        return transformTarget(dns, StatusEnum.ERROR);
      }
      return transformTarget(dns, StatusEnum.ACTIVATING);
    });

  const deleting = current
    .filter((dns) => !isIncluded(target, dns))
    .map((dns) => transformCurrent(dns, StatusEnum.DELETING));

  return [...activated, ...activating, ...deleting];
}

export const formatConfigurationValue = (
  options: FreeHostingOptions,
): string => {
  if (options.dnsA && options.dnsMx) {
    return 'RESET_ALL';
  }
  if (options.dnsA) {
    return 'RESET_ONLY_A';
  }
  if (options.dnsMx) {
    return 'RESET_ONLY_MX';
  }
  return 'NO_CHANGE';
};

export function getIpsSupported(
  ipv4Supported: boolean,

  ipv6Supported: boolean,

  multipleIPsSupported: boolean,
): IpsSupportedEnum {
  if (ipv4Supported && ipv6Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.All
      : IpsSupportedEnum.OneIPv4OneIPv6;
  }

  if (ipv4Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.MultipleIPv4
      : IpsSupportedEnum.OneIPv4;
  }

  if (ipv6Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.MultipleIPv6
      : IpsSupportedEnum.OneIPv6;
  }

  return IpsSupportedEnum.All;
}

export const getHostnameErrorMessage = (
  hostname: string,
  serviceName: string,
  hosts: THost[],
): string => {
  const fullHostname = `${hostname}.${serviceName}`;

  if (hosts.some((h) => h.host.toLowerCase() === fullHostname.toLowerCase())) {
    return 'domain_tab_hosts_drawer_add_invalid_host_same';
  }

  if (!z.hostname().safeParse(fullHostname).success || fullHostname === '') {
    return 'domain_tab_hosts_drawer_add_invalid_host_format';
  }

  return '';
};

export const getIpsErrorMessage = (
  ips: string[],
  ipsSupported: IpsSupportedEnum,
): string => {
  const ipv4 = z.ipv4();
  const ipv6 = z.ipv6();

  const set = new Set<string>();

  for (const ip of ips) {
    const item = ip.trim();
    if (item === '') continue;

    if (set.has(ip)) {
      return 'domain_tab_hosts_drawer_add_duplicate_ips';
    }
    set.add(ip);
  }

  switch (ipsSupported) {
    case IpsSupportedEnum.All:
      if (
        ips.some(
          (ip) => !ipv4.safeParse(ip).success && !ipv6.safeParse(ip).success,
        )
      ) {
        return 'domain_tab_hosts_drawer_add_invalid_ips';
      }
      return '';

    case IpsSupportedEnum.OneIPv4:
      if (ips.length !== 1 || !ipv4.safeParse(ips[0]).success) {
        return 'domain_tab_hosts_drawer_add_invalid_ips';
      }
      return '';

    case IpsSupportedEnum.OneIPv6:
      if (ips.length !== 1 || !ipv6.safeParse(ips[0]).success) {
        return 'domain_tab_hosts_drawer_add_invalid_ips';
      }
      return '';

    case IpsSupportedEnum.MultipleIPv4:
      if (ips.some((ip) => !ipv4.safeParse(ip).success)) {
        return 'domain_tab_hosts_drawer_add_invalid_ips';
      }
      return '';

    case IpsSupportedEnum.MultipleIPv6:
      if (ips.some((ip) => !ipv6.safeParse(ip).success)) {
        return 'domain_tab_hosts_drawer_add_invalid_ips';
      }
      return '';

    default:
      return '';
  }
};

export const tranformIpsStringToArray = (ipString: string) => {
  return ipString?.split(',').map((ip: string) => ip.trim());
};

export const areDsRecordsEqual = (
  a: TDsDataInterface,
  b: TDsDataInterface,
): boolean =>
  a.algorithm === b.algorithm &&
  a.keyTag === b.keyTag &&
  a.flags === b.flags &&
  a.publicKey === b.publicKey;

export const getSupportedAlgorithm = (
  algorithm: number,
  supportedAlgorithms: { name: string; number: number }[],
): { name: string; number: number } => {
  if (algorithm === 3) {
    return algorithm_RSASHZA3457;
  }

  const found = supportedAlgorithms.find((algo) => algo.number === algorithm);

  return (
    found ?? {
      name: '',
      number: algorithm,
    }
  );
};

export const getPublicKeyError = (value: string) => {
  if (value === '') {
    return 'domain_tab_dsrecords_drawer_form_error_empty';
  }

  if (!z.base64().safeParse(value).success) {
    return 'domain_tab_dsrecords_drawer_form_publicKey_error';
  }

  return '';
};
