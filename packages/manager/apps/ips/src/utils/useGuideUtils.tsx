import { useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { CardProps, ChangelogLinks } from '@ovh-ux/manager-react-components';

export type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

export const helpRoot = 'https://help.ovhcloud.com/csm/';

export const getGuideLinks = ({
  link,
  usFullLink,
}: {
  link: string;
  usFullLink: string;
}): GuideLinks => ({
  FR: `${helpRoot}fr-${link}`,
  GB: `${helpRoot}en-gb-${link}`,
  DE: `${helpRoot}de-${link}`,
  ES: `${helpRoot}es-es-${link}`,
  IT: `${helpRoot}it-${link}`,
  PL: `${helpRoot}pl-${link}`,
  PT: `${helpRoot}pt-${link}`,
  IE: `${helpRoot}en-ie-${link}`,
  DEFAULT: `${helpRoot}en-gb-${link}`,
  MA: `${helpRoot}fr-${link}`,
  TN: `${helpRoot}fr-${link}`,
  SN: `${helpRoot}fr-${link}`,
  ASIA: `${helpRoot}asia-${link}`,
  AU: `${helpRoot}en-au-${link}`,
  CA: `${helpRoot}en-ca-${link}`,
  IN: `${helpRoot}asia-${link}`,
  NL: `${helpRoot}en-nl-${link}`,
  QC: `${helpRoot}fr-ca-${link}`,
  SG: `${helpRoot}en-sg-${link}`,
  US: usFullLink || 'https://us.ovhcloud.com/support',
  WE: `${helpRoot}world-${link}`,
  WS: `${helpRoot}es-${link}`,
});

const URL_LIST: { [guideName: string]: GuideLinks } = {
  guideLink1: getGuideLinks({
    link:
      'public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241',
    usFullLink:
      'https://support.us.ovhcloud.com/hc/en-us/articles/19770592015891-Configuring-an-Additional-IP-Public-Cloud',
  }),
  guideLink2: getGuideLinks({
    link:
      'dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761',
    usFullLink:
      'https://support.us.ovhcloud.com/hc/en-us/articles/7154925809683-How-to-Configure-IP-Aliasing',
  }),
  guideLink3: getGuideLinks({
    link:
      'dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915',
    usFullLink:
      'https://support.us.ovhcloud.com/hc/en-us/articles/37457315856787-Configuring-the-network-on-Proxmox-VE-on-the-High-Grade-Scale-and-Advance-ranges',
  }),
  guideLink4: getGuideLinks({
    link:
      'public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
    usFullLink:
      'https://support.us.ovhcloud.com/hc/en-us/articles/21134381741715-Concepts-Additional-IP-or-Floating-IP',
  }),
  presentationLink: {
    DE: 'https://www.ovhcloud.com/de/network/additional-ip/',
    NL: 'https://www.ovhcloud.com/nl/network/additional-ip/',
    ES: 'https://www.ovhcloud.com/es-es/network/additional-ip/',
    IE: 'https://www.ovhcloud.com/en-ie/network/additional-ip/',
    IT: 'https://www.ovhcloud.com/it/network/additional-ip/',
    PL: 'https://www.ovhcloud.com/pl/network/additional-ip/',
    PT: 'https://www.ovhcloud.com/pt/network/additional-ip/',
    FR: 'https://www.ovhcloud.com/fr/network/additional-ip/',
    GB: 'https://www.ovhcloud.com/en-gb/network/additional-ip/',
    CA: 'https://www.ovhcloud.com/en-ca/network/additional-ip/',
    QC: 'https://www.ovhcloud.com/fr-ca/network/additional-ip/',
    US: 'https://us.ovhcloud.com/network/additional-ip/',
    IN: 'https://www.ovhcloud.com/en-in/network/additional-ip/',
    SN: 'https://www.ovhcloud.com/fr-sn/network/additional-ip/',
    MA: 'https://www.ovhcloud.com/fr-ma/network/additional-ip/',
    TN: 'https://www.ovhcloud.com/fr-tn/network/additional-ip/',
    SG: 'https://www.ovhcloud.com/en-sg/network/additional-ip/',
    ASIA: 'https://www.ovhcloud.com/asia/network/additional-ip/',
    AU: 'https://www.ovhcloud.com/en-au/network/additional-ip/',
    WS: 'https://www.ovhcloud.com/es/network/additional-ip/',
    WE: 'https://www.ovhcloud.com/en/network/additional-ip/',
    DEFAULT: 'https://www.ovhcloud.com/en-ie/network/additional-ip/',
  },
  documentationLink: {
    DE:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=de',
    NL:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=nl',
    ES:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=es',
    IE:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    IT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=it',
    PL:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=pl',
    PT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=pt',
    FR:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    GB:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    CA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    QC:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    US:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    IN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    SN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    MA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    TN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    SG:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    ASIA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    AU:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    WS:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=es',
    WE:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    DEFAULT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
  },
  byoipLink: {
    DE: 'https://www.ovhcloud.com/de/network/byoip/',
    NL: 'https://www.ovhcloud.com/nl/network/byoip/',
    ES: 'https://www.ovhcloud.com/es-es/network/byoip/',
    IE: 'https://www.ovhcloud.com/en-ie/network/byoip/',
    IT: 'https://www.ovhcloud.com/it/network/byoip/',
    PL: 'https://www.ovhcloud.com/pl/network/byoip/',
    PT: 'https://www.ovhcloud.com/pt/network/byoip/',
    FR: 'https://www.ovhcloud.com/fr/network/byoip/',
    GB: 'https://www.ovhcloud.com/en-gb/network/byoip/',
    CA: 'https://www.ovhcloud.com/en-ca/network/byoip/',
    QC: 'https://www.ovhcloud.com/fr-ca/network/byoip/',
    IN: 'https://www.ovhcloud.com/en-in/network/byoip/',
    SN: 'https://www.ovhcloud.com/fr-sn/network/byoip/',
    MA: 'https://www.ovhcloud.com/fr-ma/network/byoip/',
    TN: 'https://www.ovhcloud.com/fr-tn/network/byoip/',
    SG: 'https://www.ovhcloud.com/en-sg/network/byoip/',
    ASIA: 'https://www.ovhcloud.com/asia/network/byoip/',
    AU: 'https://www.ovhcloud.com/en-au/network/byoip/',
    US: 'https://us.ovhcloud.com/network/byoip/',
    WE: 'https://www.ovhcloud.com/en/network/byoip/',
    WS: 'https://www.ovhcloud.com/es/network/byoip/',
    DEFAULT: 'https://www.ovhcloud.com/en-gb/network/byoip/',
  },
};

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=IP',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=IP ',
  'feature-request':
    'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function getUrlListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(URL_LIST);
  keys.forEach((key) => {
    list[key[0]] =
      URL_LIST[key[0]][subsidiary as CountryCode] || URL_LIST[key[0]].DEFAULT;
  });
  return list;
}

export function useGuideUtils(): {
  guides: CardProps[];
  links: { [linkName: string]: string };
} {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.user;
  const { t } = useTranslation('onboarding');

  const links = useMemo(() => getUrlListLink({ subsidiary: ovhSubsidiary }), [
    ovhSubsidiary,
  ]);

  return {
    links,
    guides: useMemo(
      () =>
        Object.entries(links)
          .filter(([title]) => title.includes('guide'))
          .map(([, href], index) => ({
            href,
            texts: {
              title: t(`guide${index + 1}Title`),
              description: t(`guide${index + 1}Description`),
              category: t('guideCategory'),
            },
          })),
      [ovhSubsidiary],
    ),
  };
}
