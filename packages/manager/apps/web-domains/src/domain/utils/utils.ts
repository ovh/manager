import { GUIDES_LIST, LangCode } from '@/domain/constants/guideLinks';
import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServer,
  TNameServerWithType,
  NameServerStatus,
  NameServerType,
} from '../types/domainResource';
import { DNS_TYPES } from '../constants/serviceDetail';

export function getLanguageKey(lang: string): LangCode {
  const code = lang.split(/[-_]/)[0].toUpperCase();
  const isSupported = code in GUIDES_LIST.domains.url;

  return isSupported ? (code as LangCode) : 'DEFAULT';
}

function isIncluded(
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

function transform(
  dns: TNameServer | TNameServerWithType,
  status: NameServerStatus,
): TDatagridDnsDetails {
  let type: NameServerType;

  if (
    'nameServerType' in dns &&
    DNS_TYPES.includes(dns.nameServerType as NameServerType)
  ) {
    type = dns.nameServerType as NameServerType;
  } else {
    type = 'STANDARD';
  }

  return {
    name: dns.nameServer,
    ip: dns.ipv4 || dns.ipv6 || '-',
    status,
    type,
  };
}

export function computeDnsDetails(
  domainResource: TDomainResource,
): TDatagridDnsDetails[] {
  const current = domainResource.currentState.dnsConfiguration.nameServers;
  const target = domainResource.targetSpec.dnsConfiguration.nameServers;
  const updateIsInError = domainResource.currentTasks.find(
    (task) =>
      task.type === 'DomainDnsUpdate' && task.status.toLowerCase() === 'error',
  );

  const activated = current
    .filter((x) => isIncluded(target, x))
    .map((x) => transform(x, 'ENABLED'));

  const activating = target
    .filter((x) => !isIncluded(current, x))
    .map((x) => {
      if (updateIsInError) {
        return transform(x, 'ERROR');
      }
      return transform(x, 'ACTIVATING');
    });

  const deleting = current
    .filter((x) => !isIncluded(target, x))
    .map((x) => transform(x, 'DELETING'));

  return [...activated, ...activating, ...deleting];
}
