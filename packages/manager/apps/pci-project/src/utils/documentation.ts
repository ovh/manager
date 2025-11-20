import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { DOC_BASE_URL, OVH_CLOUD_URL, OVH_LANGUAGE_BY_SUBSIDIARY } from '../constants/base';

// Function to get HDS info URL for a given subsidiary with automatic fallback
export const getHdsInfoUrl = (subsidiary: OvhSubsidiary): string => {
  const HDS_URL = 'enterprise/certification-conformity/hds/';
  const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];
  return `${OVH_CLOUD_URL}/${language}/${HDS_URL}`;
};

// KB Article IDs for documentation guides by subsidiary
const DOCUMENTATION_KB_BY_SUB: Record<string, Partial<Record<OvhSubsidiary, string>>> = {
  getting_started: {
    DEFAULT: 'KB0050388', // en-gb
    DE: 'KB0050383', // de
    ES: 'KB0050389', // es-es
    FR: 'KB0050407', // fr
    IE: 'KB0050387', // en-ie
    IT: 'KB0050404', // it
    PL: 'KB0050394', // pl
    PT: 'KB0050395', // pt
    CA: 'KB0050398', // en-ca
    QC: 'KB0050397', // fr-ca
    WS: 'KB0050392', // es
    AU: 'KB0038069', // en-au
    IN: 'KB0069446', // en-in
    SG: 'KB0050393', // en-sg
    ASIA: 'KB0050384', // asia
  },
  public_cloud: {
    DEFAULT: 'KB0050399', // en-gb
    DE: 'KB0050396', // de
    ES: 'KB0050416', // es-es
    FR: 'KB0050409', // fr
    IE: 'KB0050401', // en-ie
    IT: 'KB0050403', // it
    PL: 'KB0050406', // pl
    PT: 'KB0050411', // pt
    CA: 'KB0050400', // en-ca
    QC: 'KB0050408', // fr-ca
    WS: 'KB0050417', // es
    AU: 'KB0050410', // en-au
    IN: 'KB0069451', // en-in
    SG: 'KB0050402', // en-sg
    ASIA: 'KB0038083', // asia
  },
  instances: {
    DEFAULT: 'KB0050758', // en-gb
    DE: 'KB0050755', // de
    ES: 'KB0050761', // es-es
    FR: 'KB0050764', // fr
    IE: 'KB0050766', // en-ie
    IT: 'KB0050765', // it
    PL: 'KB0050768', // pl
    PT: 'KB0050776', // pt
    CA: 'KB0050754', // en-ca
    QC: 'KB0050762', // fr-ca
    WS: 'KB0050760', // es
    AU: 'KB0050756', // en-au
    IN: 'KB0069231', // en-in
    SG: 'KB0050759', // en-sg
    ASIA: 'KB0038462', // asia
  },
  billing: {
    DEFAULT: 'KB0050453', // en-gb
    DE: 'KB0050448', // de
    ES: 'KB0050457', // es-es
    FR: 'KB0050459', // fr
    IE: 'KB0050454', // en-ie
    IT: 'KB0050461', // it
    PL: 'KB0050472', // pl
    PT: 'KB0050474', // pt
    CA: 'KB0050452', // en-ca
    QC: 'KB0050460', // fr-ca
    WS: 'KB0050462', // es
    AU: 'KB0038140', // en-au
    IN: 'KB0069450', // en-in
    SG: 'KB0050465', // en-sg
    ASIA: 'KB0050463', // asia
  },
};

// Function to get documentation guide URL for a given guide and subsidiary
export const getDocumentationGuideLink = (guideName: string, subsidiary: OvhSubsidiary): string => {
  const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];

  // Special case for guides - uses csm_index instead of KB article
  if (guideName === 'guides') {
    return `${DOC_BASE_URL}/${language}-home?id=csm_index`;
  }

  const kbId =
    DOCUMENTATION_KB_BY_SUB[guideName]?.[subsidiary] || DOCUMENTATION_KB_BY_SUB[guideName]?.DEFAULT;

  // Map guide names to their specific paths
  const guidePaths: Record<string, string> = {
    getting_started: 'public-cloud-compute-essential-information',
    public_cloud: 'public-cloud-compute-control-panel',
    instances: 'public-cloud-compute-getting-started-instance',
    billing: 'public-cloud-compute-billing-options',
  };

  const path = guidePaths[guideName];
  return `${DOC_BASE_URL}/${language}-${path}?id=kb_article_view&sysparm_article=${kbId}`;
};
