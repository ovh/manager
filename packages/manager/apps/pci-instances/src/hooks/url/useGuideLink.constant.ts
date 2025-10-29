import { Subsidiary } from '@ovh-ux/manager-config';

const HELP_ROOT = 'https://www.ovhcloud.com';

const HELP_URL = 'https://help.ovhcloud.com/csm';

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
  | 'DISTRIBUTION_IMAGE_LIFE_CYCLE';

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
    DEFAULT: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
    FR: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
  },
  DISTRIBUTION_IMAGE: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
    FR: `${HELP_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
  },
  DISTRIBUTION_IMAGE_LIFE_CYCLE: {
    DEFAULT: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
    FR: `${HELP_URL}/fr-public-cloud-compute-vps-image-life-cycle?id=kb_article_view&sysparm_article=KB0050802`,
  },
};
