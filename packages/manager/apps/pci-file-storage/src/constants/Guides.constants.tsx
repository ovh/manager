import type { Subsidiary } from '@ovh-ux/manager-config';
import type { GuideMenuItem } from '@ovh-ux/muk';

export type GuideLinks = Record<'DEFAULT', string> & Partial<Record<Subsidiary, string>>;
type OnboardingGuide = {
  key: string;
  links: GuideLinks;
};

export const GUIDES: OnboardingGuide[] = [
  { key: 'learn-more', links: { DEFAULT: 'https://labs.ovhcloud.com/en/file-storage/' } },
  {
    key: 'get-started',
    links: {
      DEFAULT:
        'https://help.ovhcloud.com/csm/en-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072892',
      ASIA: 'https://help.ovhcloud.com/csm/asia-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072901',
      AU: 'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072898',
      CA: 'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072893',
      DE: 'https://help.ovhcloud.com/csm/de-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072895',
      ES: 'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072903',
      FR: 'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
      GB: 'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072894',
      IE: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072899',
      IN: 'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072890',
      IT: 'https://help.ovhcloud.com/csm/it-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072896',
      MA: 'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
      NL: 'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072899',
      PL: 'https://help.ovhcloud.com/csm/pl-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072888',
      PT: 'https://help.ovhcloud.com/csm/pt-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072897',
      QC: 'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072900',
      SG: 'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072889',
      SN: 'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
      TN: 'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
      US: 'https://support.us.ovhcloud.com/hc/en-us/articles/47960500366099-File-Storage-Service-Getting-started',
      WE: 'https://help.ovhcloud.com/csm/en-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072892',
      WS: 'https://help.ovhcloud.com/csm/es-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072891',
    },
  },
  { key: 'discord', links: { DEFAULT: 'https://discord.com/invite/ovhcloud' } },
];

export function getOnboardingLinkFor(links: GuideLinks, subsidiary: Subsidiary): string;
export function getOnboardingLinkFor(guideKey: string, subsidiary: Subsidiary): string;
export function getOnboardingLinkFor(
  linksOrKey: GuideLinks | string,
  subsidiary: Subsidiary,
): string {
  if (typeof linksOrKey === 'string') {
    const guide = GUIDES.find((g) => g.key === linksOrKey);
    if (!guide) return '';
    return guide.links[subsidiary] ?? guide.links.DEFAULT;
  }
  return linksOrKey[subsidiary] ?? linksOrKey.DEFAULT;
}

export function getFileStorageGuideItems(
  subsidiary: Subsidiary,
  gettingStartedLabel: string,
): GuideMenuItem[] {
  return [
    {
      id: 0,
      href: getOnboardingLinkFor('get-started', subsidiary),
      target: '_blank',
      children: gettingStartedLabel,
    },
  ];
}
