import {
  GuideLinks,
  GUIDES_LIST,
  LangCode,
} from '@/domain/constants/guideLinks';
import {
  TDatagridDnsDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import {
  isIncluded,
  transformCurrent,
  transformTarget,
} from '@/domain/utils/dnsUtils';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';
import { DNS_UPDATE_OPERATION } from '../constants/dns.const';

export function getLanguageKey(lang: string): LangCode {
  const code = lang.split(/[-_]/)[0].toUpperCase();
  const isSupported = code in GUIDES_LIST.domains.url;

  return isSupported ? (code as LangCode) : 'DEFAULT';
}

export function generateGuideLinks(template: string): GuideLinks {
  return {
    FR: template.replace('{{lang}}', 'fr'),
    EN: template.replace('{{lang}}', 'en-gb'),
    DE: template.replace('{{lang}}', 'de'),
    ES: template.replace('{{lang}}', 'es-es'),
    IT: template.replace('{{lang}}', 'it'),
    PL: template.replace('{{lang}}', 'pl'),
    PT: template.replace('{{lang}}', 'pt'),
    DEFAULT: template.replace('{{lang}}', 'fr'),
  };
}

export function computeDnsDetails(
  domainResource: TDomainResource,
): TDatagridDnsDetails[] {
  const current = domainResource.currentState.dnsConfiguration.nameServers;
  const target = domainResource.targetSpec.dnsConfiguration.nameServers;
  const updateIsInError = domainResource.currentTasks.find(
    (task) =>
      task.type === DNS_UPDATE_OPERATION &&
      task.status.toLowerCase() === NameServerStatusEnum.ERROR.toLowerCase(),
  );

  const activated = current
    .filter((dns) => isIncluded(target, dns))
    .map((dns) => transformCurrent(dns, NameServerStatusEnum.ENABLED));

  const activating = target
    .filter((dns) => !isIncluded(current, dns))
    .map((dns) => {
      if (updateIsInError) {
        return transformTarget(dns, NameServerStatusEnum.ERROR);
      }
      return transformTarget(dns, NameServerStatusEnum.ACTIVATING);
    });

  const deleting = current
    .filter((dns) => !isIncluded(target, dns))
    .map((dns) => transformCurrent(dns, NameServerStatusEnum.DELETING));

  return [...activated, ...activating, ...deleting];
}
