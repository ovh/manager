import { ChangelogLinks } from '@ovh-ux/manager-react-components';

export interface GuideLinks {
  [key: string]: string;
  DEFAULT: string;
  FR?: string;
  GB?: string;
  DE?: string;
  ES?: string;
  IT?: string;
  PL?: string;
  PT?: string;
  IE?: string;
  MA?: string;
  TN?: string;
  SN?: string;
  IN?: string;
}

const helpRoot = 'https://help.ovhcloud.com/csm/';

const link =
  'documentation-bare-metal-cloud-dedicated-servers-network-and-ip-management?id=kb_browse_cat&kb_id=203c4f65551974502d4c6e78b7421996&kb_category=71345555f49801102d4ca4d466a7fdcb';

export const DOCUMENTATION_GUIDE: GuideLinks = {
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
};

export const GUIDES_LIST = {
  documentation_link: {
    url: DOCUMENTATION_GUIDE,
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
