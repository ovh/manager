import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { CountryCode } from '@ovh-ux/manager-config';
import { CardProps, ChangelogLinks } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

export const helpRoot = 'https://help.ovhcloud.com/csm/';

const URL_LIST: {
  [guideName: string]: { links: GuideLinks; trackingLabel: string };
} = {
  guideLink1: {
    links: {
      DEFAULT: `${helpRoot}en-ie-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050247`,
      DE: `${helpRoot}de-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050233`,
      ES: `${helpRoot}es-es-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050239`,
      FR: `${helpRoot}fr-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241`,
      IE: `${helpRoot}en-ie-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050247`,
      IT: `${helpRoot}it-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050243`,
      PT: `${helpRoot}pt-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050256`,
      PL: `${helpRoot}pl-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050254`,
      GB: `${helpRoot}en-gb-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050235`,
      CA: `${helpRoot}en-ca-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050236`,
      QC: `${helpRoot}fr-ca-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050242`,
      WS: `${helpRoot}es-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050240`,
      WE: `${helpRoot}en-ie-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050247`,
      NL: `${helpRoot}en-ie-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050247`,
      MA: `${helpRoot}fr-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241`,
      SN: `${helpRoot}fr-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241`,
      TN: `${helpRoot}fr-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241`,
      AU: `${helpRoot}en-au-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050234`,
      IN: `${helpRoot}en-in-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0069597`,
      SG: `${helpRoot}en-sg-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050246`,
      ASIA: `${helpRoot}asia-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0037889`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/19770592015891-Configuring-an-Additional-IP-Public-Cloud',
    },
    trackingLabel: 'public-cloud-network-configure-additional-ip',
  },
  guideLink2: {
    links: {
      DEFAULT: `${helpRoot}en-ie-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043752`,
      DE: `${helpRoot}de-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043749`,
      ES: `${helpRoot}es-es-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043760`,
      IE: `${helpRoot}en-ie-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043752`,
      NL: `${helpRoot}en-ie-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043752`,
      FR: `${helpRoot}fr-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761`,
      IT: `${helpRoot}it-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043763`,
      PL: `${helpRoot}pl-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043770`,
      PT: `${helpRoot}pt-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043774`,
      GB: `${helpRoot}en-gb-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043753`,
      CA: `${helpRoot}en-ca-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043757`,
      QC: `${helpRoot}fr-ca-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043759`,
      WS: `${helpRoot}es-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043768`,
      MA: `${helpRoot}fr-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761`,
      SN: `${helpRoot}fr-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761`,
      TN: `${helpRoot}fr-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761`,
      AU: `${helpRoot}en-au-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043754`,
      IN: `${helpRoot}en-in-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0067961`,
      SG: `${helpRoot}en-sg-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043762`,
      ASIA: `${helpRoot}asia-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0030786`,
      WE: `${helpRoot}en-ie-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043752`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/7154925809683-How-to-Configure-IP-Aliasing',
    },
    trackingLabel: 'dedicated-servers-network-ipaliasing',
  },
  guideLink3: {
    links: {
      DEFAULT: `${helpRoot}en-ie-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043909`,
      DE: `${helpRoot}de-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043914`,
      ES: `${helpRoot}es-es-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043912`,
      FR: `${helpRoot}fr-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915`,
      IE: `${helpRoot}en-ie-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043909`,
      NL: `${helpRoot}en-ie-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043909`,
      IT: `${helpRoot}it-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043917`,
      PL: `${helpRoot}pl-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043916`,
      PT: `${helpRoot}pt-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043918`,
      GB: `${helpRoot}en-gb-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043899`,
      CA: `${helpRoot}en-ca-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043904`,
      QC: `${helpRoot}fr-ca-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043925`,
      WS: `${helpRoot}es-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043921`,
      MA: `${helpRoot}fr-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915`,
      SN: `${helpRoot}fr-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915`,
      TN: `${helpRoot}fr-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915`,
      AU: `${helpRoot}en-au-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043902`,
      IN: `${helpRoot}en-in-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0067971`,
      SG: `${helpRoot}en-sg-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043911`,
      ASIA: `${helpRoot}asia-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0030946`,
      WE: `${helpRoot}en-ie-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043909`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/37457315856787-Configuring-the-network-on-Proxmox-VE-on-the-High-Grade-Scale-and-Advance-ranges',
    },
    trackingLabel: 'dedicated-servers-proxmox-network-hg-scale',
  },
  guideLink4: {
    links: {
      DEFAULT: `${helpRoot}en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162`,
      DE: `${helpRoot}de-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0037798`,
      ES: `${helpRoot}es-es-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050166`,
      FR: `${helpRoot}fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159`,
      IT: `${helpRoot}it-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050156`,
      IE: `${helpRoot}en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162`,
      NL: `${helpRoot}en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162`,
      PL: `${helpRoot}pl-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050160`,
      PT: `${helpRoot}pt-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050161`,
      GB: `${helpRoot}en-gb-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050147`,
      CA: `${helpRoot}en-ca-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050146`,
      QC: `${helpRoot}fr-ca-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050158`,
      WS: `${helpRoot}es-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050169`,
      MA: `${helpRoot}fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159`,
      SN: `${helpRoot}fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159`,
      TN: `${helpRoot}fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159`,
      AU: `${helpRoot}en-au-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050157`,
      IN: `${helpRoot}en-in-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0069583`,
      SG: `${helpRoot}en-sg-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050150`,
      ASIA: `${helpRoot}asia-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050155`,
      WE: `${helpRoot}en-ie-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050162`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/21134381741715-Concepts-Additional-IP-or-Floating-IP',
    },
    trackingLabel: 'public-cloud-network-additional-ip-vs-floating-ip',
  },
  guideLink5: {
    links: {
      DEFAULT: `${helpRoot}en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826`,
      DE: `${helpRoot}de-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062832`,
      ES: `${helpRoot}es-es-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062830`,
      IE: `${helpRoot}en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826`,
      NL: `${helpRoot}en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826`,
      FR: `${helpRoot}fr-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062825`,
      IT: `${helpRoot}it-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062839`,
      PL: `${helpRoot}pl-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062837`,
      PT: `${helpRoot}pt-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062831`,
      GB: `${helpRoot}en-gb-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062828`,
      CA: `${helpRoot}en-ca-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062827`,
      QC: `${helpRoot}fr-ca-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062834`,
      WS: `${helpRoot}es-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062835`,
      MA: `${helpRoot}fr-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062825`,
      SN: `${helpRoot}fr-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062825`,
      TN: `${helpRoot}fr-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062825`,
      AU: `${helpRoot}en-au-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062836`,
      IN: `${helpRoot}en-in-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0067889`,
      SG: `${helpRoot}en-sg-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062829`,
      ASIA: `${helpRoot}asia-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062833`,
      WE: `${helpRoot}en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/31163475160211-Configuring-an-Additional-IPv6-block-in-a-vRack',
    },
    trackingLabel: 'dedicated-servers-configure-an-ipv6-in-a-vrack',
  },
  configureReverseDnsGuide: {
    links: {
      DEFAULT: `${helpRoot}en-ie-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047596`,
      DE: `${helpRoot}de-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047597`,
      ES: `${helpRoot}es-es-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047600`,
      FR: `${helpRoot}fr-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047603`,
      IE: `${helpRoot}en-ie-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047596`,
      IT: `${helpRoot}it-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047605`,
      NL: `${helpRoot}en-ie-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047596`,
      PL: `${helpRoot}pl-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047606`,
      PT: `${helpRoot}pt-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047608`,
      GB: `${helpRoot}en-gb-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047594`,
      CA: `${helpRoot}en-ca-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047598`,
      QC: `${helpRoot}fr-ca-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047604`,
      WS: `${helpRoot}es-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047601`,
      MA: `${helpRoot}fr-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047603`,
      SN: `${helpRoot}fr-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047603`,
      TN: `${helpRoot}fr-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047603`,
      AU: `${helpRoot}en-au-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047593`,
      IN: `${helpRoot}en-in-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0068113`,
      SG: `${helpRoot}en-sg-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047599`,
      ASIA: `${helpRoot}asia-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0034962`,
      WE: `${helpRoot}en-ie-vps-configure-reverse-dns?id=kb_article_view&sysparm_article=KB0047596`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/360002181530-How-to-Configure-Reverse-DNS',
    },
    trackingLabel: 'vps-configure-reverse-dns',
  },
  configureGameFirewall: {
    links: {
      DEFAULT: `${helpRoot}en-ie-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060676`,
      DE: `${helpRoot}de-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060678`,
      ES: `${helpRoot}es-es-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060679`,
      IE: `${helpRoot}en-ie-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060676`,
      IT: `${helpRoot}it-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060681`,
      NL: `${helpRoot}en-ie-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060676`,
      PL: `${helpRoot}pl-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060682`,
      PT: `${helpRoot}pt-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060674`,
      GB: `${helpRoot}en-gb-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060687`,
      FR: `${helpRoot}fr-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060685`,
      CA: `${helpRoot}en-ca-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060683`,
      QC: `${helpRoot}fr-ca-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060688`,
      WS: `${helpRoot}es-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060673`,
      MA: `${helpRoot}fr-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060685`,
      SN: `${helpRoot}fr-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060685`,
      TN: `${helpRoot}fr-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060685`,
      AU: `${helpRoot}en-au-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060684`,
      IN: `${helpRoot}en-in-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0067917`,
      SG: `${helpRoot}en-sg-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060675`,
      ASIA: `${helpRoot}asia-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060686`,
      WE: `${helpRoot}en-ie-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=KB0060676`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/24578879059347-Protecting-a-Game-Server-with-the-Application-Firewall',
    },
    trackingLabel: 'dedicated-servers-game-ddos-firewall',
  },
  configureEdgeNetworkFirewall: {
    links: {
      DEFAULT: `${helpRoot}en-ie-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043450`,
      DE: `${helpRoot}de-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0030464`,
      ES: `${helpRoot}es-es-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043451`,
      FR: `${helpRoot}fr-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043455`,
      IE: `${helpRoot}en-ie-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043450`,
      IT: `${helpRoot}it-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043454`,
      NL: `${helpRoot}en-ie-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043450`,
      PL: `${helpRoot}pl-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043457`,
      PT: `${helpRoot}pt-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043456`,
      GB: `${helpRoot}en-gb-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043447`,
      CA: `${helpRoot}en-ca-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043446`,
      QC: `${helpRoot}fr-ca-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043453`,
      WS: `${helpRoot}es-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043452`,
      MA: `${helpRoot}fr-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043455`,
      SN: `${helpRoot}fr-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043455`,
      TN: `${helpRoot}fr-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043455`,
      AU: `${helpRoot}en-au-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043445`,
      IN: `${helpRoot}en-in-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0067913`,
      SG: `${helpRoot}en-sg-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043449`,
      ASIA: `${helpRoot}asia-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043444`,
      WE: `${helpRoot}en-ie-dedicated-servers-firewall-network?id=kb_article_view&sysparm_article=KB0043450`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/115001729044-Enabling-and-configuring-the-Edge-Network-Firewall',
    },
    trackingLabel: 'dedicated-servers-firewall-network',
  },
  presentationLink: {
    links: {
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
    trackingLabel: 'presentation-additional-ip',
  },
  documentationLink: {
    links: {
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
    trackingLabel: 'documentation-additional-ip',
  },
  byoipLink: {
    links: {
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
    trackingLabel: 'presentation-byoip',
  },
  aggreateSliceLink: {
    links: {
      DE:
        'https://help.ovhcloud.com/csm/de-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044858',
      NL:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
      ES:
        'https://help.ovhcloud.com/csm/es-es-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0031977',
      IE:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
      IT:
        'https://help.ovhcloud.com/csm/it-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044860',
      PL:
        'https://help.ovhcloud.com/csm/pl-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044862',
      PT:
        'https://help.ovhcloud.com/csm/pt-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044863',
      FR:
        'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
      GB:
        'https://help.ovhcloud.com/csm/en-gb-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044849',
      CA:
        'https://help.ovhcloud.com/csm/en-ca-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044846',
      QC:
        'https://help.ovhcloud.com/csm/fr-ca-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044857',
      IN:
        'https://help.ovhcloud.com/csm/en-in-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0068686',
      SN:
        'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
      MA:
        'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
      TN:
        'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
      SG:
        'https://help.ovhcloud.com/csm/en-sg-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044855',
      ASIA:
        'https://help.ovhcloud.com/csm/asia-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044845',
      AU:
        'https://help.ovhcloud.com/csm/en-au-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044847',
      US:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
      WE:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
      WS:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
      DEFAULT:
        'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
    },
    trackingLabel: 'bring-your-own-ip-aggregate-slice',
  },
  virtualMacLink: {
    links: {
      DE:
        'https://help.ovhcloud.com/csm/de-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0030832',
      NL:
        'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043806',
      ES:
        'https://help.ovhcloud.com/csm/es-es-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043800',
      IE:
        'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043806',
      IT:
        'https://help.ovhcloud.com/csm/it-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043803',
      PL:
        'https://help.ovhcloud.com/csm/pl-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043805',
      PT:
        'https://help.ovhcloud.com/csm/pt-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043802',
      CA:
        'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043792',
      GB:
        'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043793',
      FR:
        'https://help.ovhcloud.com/csm/fr-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043804',
      QC:
        'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043809',
      IN:
        'https://help.ovhcloud.com/csm/en-in-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0067960',
      SN:
        'https://help.ovhcloud.com/csm/fr-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043804',
      MA:
        'https://help.ovhcloud.com/csm/fr-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043804',
      TN:
        'https://help.ovhcloud.com/csm/fr-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043804',
      SG:
        'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043798',
      ASIA:
        'https://help.ovhcloud.com/csm/asia-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043794',
      AU:
        'https://help.ovhcloud.com/csm/en-au-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043796',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/4967769032083-Assigning-a-Virtual-MAC-to-an-Additional-IP',
      WE:
        'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043806',
      WS:
        'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043806',
      DEFAULT:
        'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-network-virtual-mac?id=kb_article_view&sysparm_article=KB0043793',
    },
    trackingLabel: 'dedicated-servers-network-virtual-mac',
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
  const list = {} as {
    [guideName: string]: { link: string; trackingLabel: string };
  };

  Object.entries(URL_LIST).forEach(([key, value]) => {
    list[key] = {
      link: value.links[subsidiary as CountryCode] || value.links.DEFAULT,
      trackingLabel: value.trackingLabel,
    };
  });

  return list;
}

export function useGuideUtils(): {
  guides: CardProps[];
  links: { [linkName: string]: { link: string; trackingLabel: string } };
} {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.user;
  const { t } = useTranslation('onboarding');

  const links = getUrlListLink({ subsidiary: ovhSubsidiary });
  const guides = Object.entries(links)
    .filter(([title]) => title.includes('guide'))
    .map(([, { link, trackingLabel }], index) => ({
      href: link,
      trackingLabel,
      texts: {
        title: t(`guide${index + 1}Title`),
        description: t(`guide${index + 1}Description`),
        category: t('guideCategory'),
      },
    }));

  return {
    links,
    guides,
  };
}
