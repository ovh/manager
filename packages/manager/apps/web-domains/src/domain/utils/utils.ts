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
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';

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

export function getIpsSupported(
  ipv4Supported: boolean,

  ipv6Supported: boolean,

  multipleIPsSupported: boolean,
): IpsSupportedEnum {
  if (ipv4Supported && ipv6Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.All
      : IpsSupportedEnum.OnlyIPv4IPv6;
  }

  if (ipv4Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.MultipleIPv4
      : IpsSupportedEnum.OnlyIPv4;
  }

  if (ipv6Supported) {
    return multipleIPsSupported
      ? IpsSupportedEnum.MultipleIPv6
      : IpsSupportedEnum.OnlyIPv6;
  }

  throw new Error('Unsupported combination: no IP version supported');
}
