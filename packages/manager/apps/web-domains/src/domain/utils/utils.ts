import { z } from 'zod/v4';
import { TFunction } from 'i18next';
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
import { DNS_UPDATE_OPERATION } from '@/domain/constants/dns.const';
import { FreeHostingOptions } from '@/domain/components/AssociatedServicesCards/Hosting';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';
import { THost } from '@/domain/types/host';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { algorithm_RSASHZA3457 } from '@/domain/constants/dsRecords';

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
      : IpsSupportedEnum.OneIPv4OrOneIPv6;
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

export const isDuplicateHost = (
  value: string,
  hostsTargetSpec: THost[],
  serviceName: string,
) => {
  const candidate = `${value}.${serviceName}`.toLowerCase();
  return hostsTargetSpec.some((h) => h.host.toLowerCase() === candidate);
};

export const isValidHostSyntax = (value: string, serviceName: string) => {
  const candidate = `${value}.${serviceName}`;
  return z.hostname().safeParse(candidate).success && candidate !== '';
};

export const makeHostValidators = (
  hostsTargetSpec: THost[],
  serviceName: string,
  t: TFunction,
) => {
  return {
    noDuplicate: (value: string) =>
      !isDuplicateHost(value, hostsTargetSpec, serviceName) ||
      t('domain_tab_hosts_drawer_add_invalid_host_same'),
    validSyntax: (value: string) =>
      isValidHostSyntax(value, serviceName) ||
      t('domain_tab_hosts_drawer_add_invalid_host_format'),
  };
};

export const isDuplicateIps = (ips: string[]) => {
  const hasDuplicate = ips
    .map((ip) => ip.trim())
    .some((item, idx, arr) => {
      if (item === '') return false;
      return arr.indexOf(item) !== idx;
    });

  return hasDuplicate;
};

export const isValidIpv4 = (ip: string) => {
  return z.ipv4().safeParse(ip).success;
};

export const isValidIpv6 = (ip: string) => {
  return z.ipv6().safeParse(ip).success;
};

export const areIPsValid = (ips: string[], ipsSupported: IpsSupportedEnum) => {
  // Check the number of provided IPs
  const onlyOneIpSupported =
    ipsSupported === IpsSupportedEnum.OneIPv4OrOneIPv6 ||
    ipsSupported === IpsSupportedEnum.OneIPv4 ||
    ipsSupported === IpsSupportedEnum.OneIPv6;

  if (ips.length === 0 || (onlyOneIpSupported && ips.length !== 1)) {
    return false;
  }

  // Check the provided IPs syntax
  switch (ipsSupported) {
    case IpsSupportedEnum.OneIPv4:
    case IpsSupportedEnum.MultipleIPv4: {
      return ips.every((ip) => isValidIpv4(ip));
    }
    case IpsSupportedEnum.OneIPv6:
    case IpsSupportedEnum.MultipleIPv6: {
      return ips.every((ip) => isValidIpv6(ip));
    }
    case IpsSupportedEnum.OneIPv4OrOneIPv6:
    case IpsSupportedEnum.All: {
      return ips.every((ip) => isValidIpv4(ip) || isValidIpv6(ip));
    }
    default:
      return false; // invalid enum value
  }
};

export const transformIpsStringToArray = (ipString: string) => {
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

export const makeIpsValidator = (
  ipsSupported: IpsSupportedEnum,
  t: TFunction,
) => {
  return {
    noDuplicate: (value: string) =>
      !isDuplicateIps(transformIpsStringToArray(value)) ||
      t('domain_tab_hosts_drawer_add_duplicate_ips'),
    validIps: (value: string) =>
      areIPsValid(transformIpsStringToArray(value), ipsSupported) ||
      t('domain_tab_hosts_drawer_add_invalid_ips'),
  };
};
