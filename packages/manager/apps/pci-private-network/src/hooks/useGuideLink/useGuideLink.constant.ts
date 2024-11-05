import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

type GuideLinks = { [key in OvhSubsidiary]: string };

const HELP_DOC_ROOT = 'https://docs.ovh.com/';
const HELP_ROOT = 'https://www.ovhcloud.com/';
const PRIVATE_NETWORK_URL =
  '/publiccloud/network-services/creating-private-network-with-gateway/';
const REGION_AVAILABILITY_URL = '/public-cloud/regions-availability/';

export const GUIDE_LINKS: { [guideName: string]: Partial<GuideLinks> } = {
  PRIVATE_NETWORK_WITH_GATEWAY: {
    DEFAULT: `${HELP_DOC_ROOT}gb/en${PRIVATE_NETWORK_URL}`,
    ASIA: `${HELP_DOC_ROOT}asia/en${PRIVATE_NETWORK_URL}`,
    DE: `${HELP_DOC_ROOT}de${PRIVATE_NETWORK_URL}`,
    ES: `${HELP_DOC_ROOT}es${PRIVATE_NETWORK_URL}`,
    IE: `${HELP_DOC_ROOT}ie/en${PRIVATE_NETWORK_URL}`,
    IT: `${HELP_DOC_ROOT}it${PRIVATE_NETWORK_URL}`,
    PL: `${HELP_DOC_ROOT}pl${PRIVATE_NETWORK_URL}`,
    PT: `${HELP_DOC_ROOT}pt${PRIVATE_NETWORK_URL}`,
    GB: `${HELP_DOC_ROOT}gb/en${PRIVATE_NETWORK_URL}`,
    CA: `${HELP_DOC_ROOT}ca/en${PRIVATE_NETWORK_URL}`,
    QC: `${HELP_DOC_ROOT}ca/fr${PRIVATE_NETWORK_URL}`,
    MA: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    SN: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    TN: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    AU: `${HELP_DOC_ROOT}au/en${PRIVATE_NETWORK_URL}`,
    SG: `${HELP_DOC_ROOT}sg/en${PRIVATE_NETWORK_URL}`,
    FR: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    US: `${HELP_DOC_ROOT}us/en${PRIVATE_NETWORK_URL}`,
    WS: `${HELP_DOC_ROOT}us/es${PRIVATE_NETWORK_URL}`,
    WE: `${HELP_DOC_ROOT}ie/en${PRIVATE_NETWORK_URL}`,
  },
  REGION_AVAILABILITY: {
    DEFAULT: `${HELP_ROOT}gb/en${REGION_AVAILABILITY_URL}`,
    ASIA: `${HELP_ROOT}asia${REGION_AVAILABILITY_URL}`,
    DE: `${HELP_ROOT}de${REGION_AVAILABILITY_URL}`,
    ES: `${HELP_ROOT}es-es${REGION_AVAILABILITY_URL}`,
    IE: `${HELP_ROOT}en-ie${REGION_AVAILABILITY_URL}`,
    IT: `${HELP_ROOT}it${REGION_AVAILABILITY_URL}`,
    NL: `${HELP_ROOT}nl${REGION_AVAILABILITY_URL}`,
    PL: `${HELP_ROOT}pl${REGION_AVAILABILITY_URL}`,
    PT: `${HELP_ROOT}pt${REGION_AVAILABILITY_URL}`,
    GB: `${HELP_ROOT}en-gb${REGION_AVAILABILITY_URL}`,
    CA: `${HELP_ROOT}en-ca${REGION_AVAILABILITY_URL}`,
    QC: `${HELP_ROOT}fr-ca${REGION_AVAILABILITY_URL}`,
    MA: `${HELP_ROOT}fr-ma${REGION_AVAILABILITY_URL}`,
    SN: `${HELP_ROOT}fr-sn${REGION_AVAILABILITY_URL}`,
    TN: `${HELP_ROOT}fr-tn${REGION_AVAILABILITY_URL}`,
    AU: `${HELP_ROOT}en-au${REGION_AVAILABILITY_URL}`,
    SG: `${HELP_ROOT}en-sg${REGION_AVAILABILITY_URL}`,
    FR: `${HELP_ROOT}fr${REGION_AVAILABILITY_URL}`,
    WS: `${HELP_ROOT}es${REGION_AVAILABILITY_URL}`,
    WE: `${HELP_ROOT}en${REGION_AVAILABILITY_URL}`,
  },
  VLAN: {
    ASIA:
      'https://help.ovhcloud.com/csm/asia-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043360',
    AU:
      'https://help.ovhcloud.com/csm/en-au-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043715',
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043720',
    DE:
      'https://help.ovhcloud.com/csm/de-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043362',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043367',
    ES:
      'https://help.ovhcloud.com/csm/es-es-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043366',
    FR:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043369',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0030378',
    IT:
      'https://help.ovhcloud.com/csm/it-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043371',
    PT:
      'https://help.ovhcloud.com/csm/pt-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043374',
    PL:
      'https://help.ovhcloud.com/csm/pl-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043372',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043370',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043365',
    WS:
      'https://help.ovhcloud.com/csm/en-dedicated-servers-multiple-vlans?id=kb_article_view&sysparm_article=KB0043368',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/25276312027027-Creating-Multiple-vLANs-in-a-vRack',
  },
};
