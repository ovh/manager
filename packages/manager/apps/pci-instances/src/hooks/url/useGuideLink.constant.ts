import { Subsidiary } from '@ovh-ux/manager-config';

const HELP_ROOT = 'https://www.ovhcloud.com';

const HELP_URL = 'https://help.ovhcloud.com/csm';

const US_DOMAIN_ROOT = 'us.ovhcloud.com';

const US_HELP_URL = `https://support.${US_DOMAIN_ROOT}/hc/en-us/articles`;

type TGuideLinkGroup = {
  DEFAULT: string;
} & {
  [key in Subsidiary]?: string;
};

export type TGuideKey =
  | 'LOCATION'
  | 'FLAVOR'
  | 'AVAILABILITY_ZONES'
  | 'DISTRIBUTION_IMAGE'
  | 'DISTRIBUTION_IMAGE_LIFE_CYCLE'
  | 'SSH_KEY'
  | 'NETWORK'
  | 'BACKUP';

export const GUIDE_LINKS: Record<TGuideKey, TGuideLinkGroup> = {
  LOCATION: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031`,
    FR: `${HELP_URL}/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031`,
  },
  AVAILABILITY_ZONES: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031`,
    FR: `${HELP_URL}/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031`,
  },
  FLAVOR: {
    DEFAULT: `${HELP_ROOT}/en/public-cloud/virtual-instances`,
    ASIA: `${HELP_ROOT}/asia/public-cloud/virtual-instances`,
    AU: `${HELP_ROOT}/en-au/public-cloud/virtual-instances`,
    CA: `${HELP_ROOT}/en-ca/public-cloud/virtual-instances`,
    DE: `${HELP_ROOT}/de/public-cloud/virtual-instances`,
    ES: `${HELP_ROOT}/es-es/public-cloud/virtual-instances`,
    FR: `${HELP_ROOT}/fr/public-cloud/virtual-instances`,
    GB: `${HELP_ROOT}/en-gb/public-cloud/virtual-instances`,
    IE: `${HELP_ROOT}/en-ie/public-cloud/virtual-instances`,
    IN: `${HELP_ROOT}/en-in/public-cloud/virtual-instances`,
    IT: `${HELP_ROOT}/it/public-cloud/virtual-instances`,
    MA: `${HELP_ROOT}/fr-ma/public-cloud/virtual-instances`,
    NL: `${HELP_ROOT}/nl/public-cloud/virtual-instances`,
    PL: `${HELP_ROOT}/pl/public-cloud/virtual-instances`,
    PT: `${HELP_ROOT}/pt/public-cloud/virtual-instances`,
    QC: `${HELP_ROOT}/fr-ca/public-cloud/virtual-instances`,
    SG: `${HELP_ROOT}/en-sg/public-cloud/virtual-instances`,
    SN: `${HELP_ROOT}/fr-sn/public-cloud/virtual-instances`,
    TN: `${HELP_ROOT}/fr-tn/public-cloud/virtual-instances`,
    WE: `${HELP_ROOT}/en/public-cloud/virtual-instances`,
    WS: `${HELP_ROOT}/es/public-cloud/virtual-instances`,
    US: `https://${US_DOMAIN_ROOT}/public-cloud/virtual-instances`,
  },
  DISTRIBUTION_IMAGE: {
    DEFAULT: `${HELP_URL}/en-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051000`,
    ASIA: `${HELP_URL}/asia-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0038732`,
    AU: `${HELP_URL}/en-au-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051007`,
    CA: `${HELP_URL}/en-ca-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051008`,
    DE: `${HELP_URL}/de-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051002`,
    ES: `${HELP_URL}/es-es-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051005`,
    FR: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
    GB: `${HELP_URL}/en-gb-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051017`,
    IE: `${HELP_URL}/es-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051006`,
    IN: `${HELP_URL}/en-in-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0069250`,
    IT: `${HELP_URL}/it-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051025`,
    MA: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
    NL: `${HELP_URL}/en-ie-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051014`,
    PL: `${HELP_URL}/pl-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051024`,
    PT: `${HELP_URL}/pt-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051015`,
    QC: `${HELP_URL}/fr-ca-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051013`,
    SG: `${HELP_URL}/en-sg-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051004`,
    SN: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
    TN: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
    WE: `${HELP_URL}/en-ie-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051014`,
    WS: `${HELP_URL}/es-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051006`,
    US: `${US_HELP_URL}/22188629448339-Increasing-Public-Cloud-Quotas`,
  },
  DISTRIBUTION_IMAGE_LIFE_CYCLE: {
    DEFAULT: `${HELP_URL}/en-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050811`,
    ASIA: `${HELP_URL}/asia-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050798`,
    AU: `${HELP_URL}/en-au-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050799`,
    CA: `${HELP_URL}/en-ca-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050796`,
    DE: `${HELP_URL}/de-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0038513`,
    ES: `${HELP_URL}/es-es-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050807`,
    FR: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
    GB: `${HELP_URL}/en-gb-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050801`,
    IE: `${HELP_URL}/en-ie-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050805`,
    IN: `${HELP_URL}/en-in-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0069238`,
    IT: `${HELP_URL}/it-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050808`,
    MA: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
    NL: `${HELP_URL}/en-ie-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050805`,
    PL: `${HELP_URL}/pl-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050804`,
    PT: `${HELP_URL}/pt-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050818`,
    QC: `${HELP_URL}/fr-ca-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050812`,
    SG: `${HELP_URL}/en-sg-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050810`,
    SN: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
    TN: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
    WE: `${HELP_URL}/en-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050811`,
    WS: `${HELP_URL}/es-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050813`,
    US: `${US_HELP_URL}/42977670583315-Public-Cloud-and-VPS-Image-Lifecycle`,
  },
  SSH_KEY: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-compute-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0064541`,
    FR: `${HELP_URL}/fr-public-cloud-compute-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0064541`,
  },
  NETWORK: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-network-vrack?id=kb_article_view&sysparm_article=KB0050279`,
    FR: `${HELP_URL}/fr-public-cloud-network-vrack?id=kb_article_view&sysparm_article=KB0050279`,
  },
  BACKUP: {
    DEFAULT: `${HELP_URL}/en-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    ASIA: `${HELP_URL}/en-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    AU: `${HELP_URL}/en-au-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    CA: `${HELP_URL}/en-ca-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    DE: `${HELP_URL}/de-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051161`,
    ES: `${HELP_URL}/es-es-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051152`,
    FR: `${HELP_URL}/fr-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
    GB: `${HELP_URL}/en-gb-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    IE: `${HELP_URL}/en-ie-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    IN: `${HELP_URL}/en-in-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    IT: `${HELP_URL}/it-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051165`,
    MA: `${HELP_URL}/fr-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
    NL: `${HELP_URL}/en-ie-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    PL: `${HELP_URL}/pl-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051167`,
    PT: `${HELP_URL}/pt-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051159`,
    QC: `${HELP_URL}/fr-ca-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
    SG: `${HELP_URL}/en-sg-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    SN: `${HELP_URL}/fr-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
    TN: `${HELP_URL}/fr-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
    US: `${US_HELP_URL}/4460743125395-Backing-up-an-instance`,
    WE: `${HELP_URL}/en-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0069268`,
    WS: `${HELP_URL}/es-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051152`,
  },
};
