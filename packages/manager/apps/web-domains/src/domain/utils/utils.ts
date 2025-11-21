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
