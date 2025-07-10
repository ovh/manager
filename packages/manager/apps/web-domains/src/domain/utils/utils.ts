import { GUIDES_LIST, LangCode } from '@/domain/constants/guideLinks';
import {
  TDatagridDnsDetails,
  TDomainResource,
  TNameServer,
  TNameServerWithType,
} from '../types/domainResource';

export function getLanguageKey(lang: string): LangCode {
  const code = lang.split(/[-_]/)[0].toUpperCase();
  const isSupported = code in GUIDES_LIST.domains.url;

  return isSupported ? (code as LangCode) : 'DEFAULT';
}

export function computeDnsStatus(
  currentStateNameServers: TNameServerWithType,
  targetSpecNameServers: TNameServer[],
): string {
  return null;
}

export function computeDnsDetails(
  domainResource: TDomainResource,
): TDatagridDnsDetails[] {
  const currentStateNameServers =
    domainResource.currentState.dnsConfiguration.nameServers;
  const targetSpecNameServers =
    domainResource.targetSpec.dnsConfiguration.nameServers;

  // return currentStateNameServers.map((dns) => {
  //   const status = computeDnsStatus(dns, targetSpecNameServers);

  // });
  return null;
}
