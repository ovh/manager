import { z } from 'zod';
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
): string | null => {
  const fullHostname = `${hostname}.${serviceName}`;

  if (hosts.some((h) => h.host.toLowerCase() === fullHostname.toLowerCase())) {
    return 'domain_tab_hosts_drawer_add_invalid_host_same';
  }

  if (!z.hostname().safeParse(fullHostname).success) {
    return 'domain_tab_hosts_drawer_add_invalid_host_format';
  }

  return null;
};

export const isIpsInvalid = (ips: string[], ipsSupported: IpsSupportedEnum) => {
  const ipv4 = z.ipv4();
  const ipv6 = z.ipv6();

  switch (ipsSupported) {
    case IpsSupportedEnum.All:
      return ips.some(
        (ip) => !ipv4.safeParse(ip).success && !ipv6.safeParse(ip).success,
      );

    case IpsSupportedEnum.OneIPv4:
      return ips.length !== 1 || !ipv4.safeParse(ips[0]).success;

    case IpsSupportedEnum.OneIPv6:
      return ips.length !== 1 || !ipv6.safeParse(ips[0]).success;

    case IpsSupportedEnum.MultipleIPv4:
      return ips.some((ip) => !ipv4.safeParse(ip).success);

    case IpsSupportedEnum.MultipleIPv6:
      return ips.some((ip) => !ipv6.safeParse(ip).success);

    default:
      return true;
  }
};
