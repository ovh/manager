import { Subsidiary } from '@ovh-ux/manager-config';

const HELP_ROOT = 'https://www.ovhcloud.com';

type TGuideLinkGroupe = {
  DEFAULT: string;
} & {
  [key in Subsidiary]?: string;
};

export const GUIDE_LINKS: Record<string, TGuideLinkGroupe> = {
  FLAVOR: {
    DEFAULT: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
    FR: `${HELP_ROOT}/fr/public-cloud/virtual-instances/`,
  },
};
