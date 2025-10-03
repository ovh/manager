import { Subsidiary } from '@ovh-ux/manager-config';

const HELP_ROOT = 'https://www.ovhcloud.com';

type TGuideLinkGroup = {
  DEFAULT: string;
} & {
  [key in Subsidiary]?: string;
};

type TGuideKey = 'LOCATION' | 'FLAVOR';

export const GUIDE_LINKS: Record<TGuideKey, TGuideLinkGroup> = {
  LOCATION: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
    FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  },
  FLAVOR: {
    DEFAULT: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
    FR: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
  },
};
