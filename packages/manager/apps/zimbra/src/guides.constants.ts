interface GuideLinks {
  [key: string]: string | undefined;
  FR?: string;
  GB: string;
  DE?: string;
  ES?: string;
  IT?: string;
  PL?: string;
  PT?: string;
  IE: string;
  DEFAULT: string;
  MA?: string;
  TN?: string;
  SN?: string;
  IN?: string;
}

const helpRoot = 'https://help.ovhcloud.com/csm/';
const WEBMAIL = 'https://webmail.mail.ovh.net/';

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

export const GUIDES_LIST = {
  webmail: {
    key: 'zimbra_dashboard_webmail',
    url: WEBMAIL,
    tracking: '::to define',
  },
  administrator_guide: {
    key: 'zimbra_dashboard_administrator_guide',
    url: ZIMBRA_ADMINISTRATOR_GUIDE,
    tracking: '::to define',
  },
  user_guide: {
    key: 'zimbra_dashboard_user_guides',
    url: ZIMBRA_USER_GUIDE,
    tracking: '::to define',
  },
};

export default {
  GUIDES_LIST,
};
