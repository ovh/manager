import { ChangelogLinks } from '@ovh-ux/manager-react-components';

import {
  GUIDE_ADMINISTRATOR,
  GUIDE_CNAME,
  GUIDE_DNS_CONFIG,
  GUIDE_USER,
  GUIDE_WEBMAIL,
} from '@/tracking.constants';

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

export interface Guide {
  key: string;
  url: GuideLinks;
  tracking: string;
}

const helpRoot = 'https://help.ovhcloud.com/csm/';

const WEBMAIL = {
  DEFAULT: 'https://webmail.mail.ovh.net/',
};

export const ZIMBRA_USER_GUIDE: GuideLinks = {
  FR: `${helpRoot}fr-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061410`,
  GB: `${helpRoot}en-gb-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061404`,
  DE: `${helpRoot}de-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061403`,
  ES: `${helpRoot}es-es-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061406`,
  IT: `${helpRoot}it-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061408`,
  PL: `${helpRoot}pl-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061407`,
  PT: `${helpRoot}pt-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061409`,
  IE: `${helpRoot}en-ie-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061405`,
  DEFAULT: `${helpRoot}en-ie-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061405`,
  MA: `${helpRoot}fr-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061410`,
  TN: `${helpRoot}fr-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061410`,
  SN: `${helpRoot}fr-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061410`,
};

export const ZIMBRA_CNAME_GUIDE: GuideLinks = {
  FR: `${helpRoot}fr-email-cname-record?id=kb_article_view&sysparm_article=KB0053252`,
  GB: `${helpRoot}en-gb-email-cname-record?id=kb_article_view&sysparm_article=KB0053251`,
  DE: `${helpRoot}de-email-cname-record?id=kb_article_view&sysparm_article=KB0041310`,
  ES: `${helpRoot}es-es-email-cname-record?id=kb_article_view&sysparm_article=KB0053242`,
  IT: `${helpRoot}it-email-cname-record?id=kb_article_view&sysparm_article=KB0053256`,
  PL: `${helpRoot}pl-email-cname-record?id=kb_article_view&sysparm_article=KB0053259`,
  PT: `${helpRoot}pt-email-cname-record?id=kb_article_view&sysparm_article=KB0053255`,
  IE: `${helpRoot}en-ie-email-cname-record?id=kb_article_view&sysparm_article=KB0053245`,
  DEFAULT: `${helpRoot}fr-email-cname-record?id=kb_article_view&sysparm_article=KB0053252`,
  MA: `${helpRoot}en-gb-email-cname-record?id=kb_article_view&sysparm_article=KB0053251`,
  TN: `${helpRoot}fr-email-cname-record?id=kb_article_view&sysparm_article=KB0053252`,
  SN: `${helpRoot}fr-email-cname-record?id=kb_article_view&sysparm_article=KB0053252`,
};

export const ZIMBRA_ADMINISTRATOR_GUIDE: GuideLinks = {
  FR: `${helpRoot}fr-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064591`,
  GB: `${helpRoot}en-gb-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064594`,
  DE: `${helpRoot}de-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061403`,
  ES: `${helpRoot}es-es-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064587`,
  IT: `${helpRoot}it-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061408`,
  PL: `${helpRoot}pl-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064593`,
  PT: `${helpRoot}pt-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064590`,
  IE: `${helpRoot}en-ie-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064592`,
  DEFAULT: `${helpRoot}en-ie-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064592`,
  MA: `${helpRoot}fr-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064591`,
  TN: `${helpRoot}fr-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064591`,
  SN: `${helpRoot}fr-zimbra-getting-started?id=kb_article_view&sysparm_article=KB0064591`,
};

export const ZIMBRA_HOW_TO_CONFIGURE_GUIDE: GuideLinks = {
  FR: `${helpRoot}fr-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064901`,
  GB: `${helpRoot}en-gb-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064928`,
  DE: `${helpRoot}de-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064933`,
  ES: `${helpRoot}es-es-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064934`,
  IT: `${helpRoot}it-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064927`,
  PL: `${helpRoot}pl-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064931`,
  PT: `${helpRoot}pt-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064932`,
  IE: `${helpRoot}en-ie-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064929`,
  DEFAULT: `${helpRoot}en-ie-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064929`,
  MA: `${helpRoot}fr-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064901`,
  TN: `${helpRoot}fr-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064901`,
  SN: `${helpRoot}fr-zimbra-mail-apps?id=kb_article_view&sysparm_article=KB0064901`,
};

export const ZIMBRA_WEBMAIL_GUIDE: GuideLinks = {
  FR: `${helpRoot}fr-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062063`,
  GB: `${helpRoot}en-gb-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062062`,
  DE: `${helpRoot}de-mx-plan-zimbra-faq?id=kb_article_view&sysparm_article=KB0061403`,
  ES: `${helpRoot}es-es-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062060`,
  IT: `${helpRoot}it-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062058`,
  PL: `${helpRoot}pl-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062061`,
  PT: `${helpRoot}pt-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062056`,
  IE: `${helpRoot}en-ie-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062057`,
  DEFAULT: `${helpRoot}en-ie-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062057`,
  MA: `${helpRoot}fr-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062063`,
  TN: `${helpRoot}fr-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062063`,
  SN: `${helpRoot}fr-mx-plan-zimbra?id=kb_article_view&sysparm_article=KB0062063`,
};

export const ZIMBRA_DNS_CONFIGURATION_GUIDE: GuideLinks = {
  FR: `${helpRoot}`,
  GB: `${helpRoot}`,
  DE: `${helpRoot}`,
  ES: `${helpRoot}`,
  IT: `${helpRoot}`,
  PL: `${helpRoot}`,
  PT: `${helpRoot}`,
  IE: `${helpRoot}`,
  DEFAULT: `${helpRoot}`,
  MA: `${helpRoot}`,
  TN: `${helpRoot}`,
  SN: `${helpRoot}`,
};

export const GUIDES_LIST = {
  webmail: {
    key: 'common:webmail',
    url: WEBMAIL,
    tracking: GUIDE_WEBMAIL,
  },
  administrator_guide: {
    key: 'zimbra_dashboard_administrator_guide',
    url: ZIMBRA_ADMINISTRATOR_GUIDE,
    tracking: GUIDE_ADMINISTRATOR,
  },
  user_guide: {
    key: 'zimbra_dashboard_user_guides',
    url: ZIMBRA_USER_GUIDE,
    tracking: GUIDE_USER,
  },
  cname_guide: {
    key: 'zimbra_cname_guide',
    url: ZIMBRA_CNAME_GUIDE,
    tracking: GUIDE_CNAME,
  },
  dns_configuration_guide: {
    key: 'zimbra_dns_configuration_guide',
    url: ZIMBRA_DNS_CONFIGURATION_GUIDE,
    tracking: GUIDE_DNS_CONFIG,
  },
};

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/18/views/2?sliceBy%5Bvalue%5D=Collaboration&pane=info',
  roadmap:
    'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Collaboration&pane=info',
  'feature-request':
    'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export default {
  GUIDES_LIST,
};
