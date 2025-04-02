const PREFIX_GUIDES_URL = 'https://help.ovhcloud.com/csm/';
const SUFFIX_URL_ADVANCED_USAGE =
  '?id=kb_browse_cat&kb_id=203c4f65551974502d4c6e78b7421996&kb_category=1a349555f49801102d4ca4d466a7fd07';
const SUFFIX_URL_TUTORIALS =
  '?id=kb_browse_cat&kb_id=203c4f65551974502d4c6e78b7421996&kb_category=0a345555f49801102d4ca4d466a7fdf8';

export const VPS_GUIDES = [
  {
    translateKey: 'vps_guides_get_started',
    url: {
      DEFAULT: `${PREFIX_GUIDES_URL}en-ie-vps-getting-started?id=kb_article_view&sysparm_article=KB0047715`,
      ASIA: `${PREFIX_GUIDES_URL}asia-vps-getting-started?id=kb_article_view&sysparm_article=KB0047713`,
      IN: `${PREFIX_GUIDES_URL}asia-vps-getting-started?id=kb_article_view&sysparm_article=KB0047713`,
      DE: `${PREFIX_GUIDES_URL}de-vps-getting-started?id=kb_article_view&sysparm_article=KB0035078`,
      ES: `${PREFIX_GUIDES_URL}es-es-vps-getting-started?id=kb_article_view&sysparm_article=KB0047728`,
      IE: `${PREFIX_GUIDES_URL}en-ie-vps-getting-started?id=kb_article_view&sysparm_article=KB0047715`,
      IT: `${PREFIX_GUIDES_URL}it-vps-getting-started?id=kb_article_view&sysparm_article=KB0047735`,
      PL: `${PREFIX_GUIDES_URL}pl-vps-getting-started?id=kb_article_view&sysparm_article=KB0047734`,
      PT: `${PREFIX_GUIDES_URL}pt-vps-getting-started?id=kb_article_view&sysparm_article=KB0047726`,
      GB: `${PREFIX_GUIDES_URL}en-gb-vps-getting-started?id=kb_article_view&sysparm_article=KB0047712`,
      CA: `${PREFIX_GUIDES_URL}en-ca-vps-getting-started?id=kb_article_view&sysparm_article=KB0047714`,
      QC: `${PREFIX_GUIDES_URL}fr-ca-vps-getting-started?id=kb_article_view&sysparm_article=KB0047723`,
      MA: `${PREFIX_GUIDES_URL}fr-vps-getting-started?id=kb_article_view&sysparm_article=KB0047736`,
      SN: `${PREFIX_GUIDES_URL}fr-vps-getting-started?id=kb_article_view&sysparm_article=KB0047736`,
      TN: `${PREFIX_GUIDES_URL}fr-vps-getting-started?id=kb_article_view&sysparm_article=KB0047736`,
      AU: `${PREFIX_GUIDES_URL}en-au-vps-getting-started?id=kb_article_view&sysparm_article=KB0047717`,
      SG: `${PREFIX_GUIDES_URL}en-sg-vps-getting-started?id=kb_article_view&sysparm_article=KB0047716`,
      FR: `${PREFIX_GUIDES_URL}fr-vps-getting-started?id=kb_article_view&sysparm_article=KB0047736`,
      WE: `${PREFIX_GUIDES_URL}en-vps-getting-started?id=kb_article_view&sysparm_article=KB0047724`,
      WS: `${PREFIX_GUIDES_URL}es-vps-getting-started?id=kb_article_view&sysparm_article=KB0047727`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/360009253639-Getting-Started-with-a-VPS',
    },
  },
  {
    translateKey: 'vps_guides_advanced_usage',
    url: {
      DEFAULT: `${PREFIX_GUIDES_URL}world-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      ASIA: `${PREFIX_GUIDES_URL}asia-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      DE: `${PREFIX_GUIDES_URL}de-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      ES: `${PREFIX_GUIDES_URL}es-es-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      IE: `${PREFIX_GUIDES_URL}en-ie-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      IT: `${PREFIX_GUIDES_URL}it-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      PL: `${PREFIX_GUIDES_URL}pl-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      PT: `${PREFIX_GUIDES_URL}pt-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      GB: `${PREFIX_GUIDES_URL}en-gb-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      CA: `${PREFIX_GUIDES_URL}en-ca-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      QC: `${PREFIX_GUIDES_URL}fr-ca-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      MA: `${PREFIX_GUIDES_URL}fr-ma-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      SN: `${PREFIX_GUIDES_URL}fr-sn-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      TN: `${PREFIX_GUIDES_URL}fr-tn-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      AU: `${PREFIX_GUIDES_URL}en-au-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      SG: `${PREFIX_GUIDES_URL}en-sg-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      FR: `${PREFIX_GUIDES_URL}fr-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      WE: `${PREFIX_GUIDES_URL}world-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      WS: `${PREFIX_GUIDES_URL}es-documentation-bare-metal-cloud-virtual-private-servers-advanced-usage${SUFFIX_URL_ADVANCED_USAGE}`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/sections/360003273859-Advanced-Usage',
    },
  },
  {
    translateKey: 'vps_guides_tutorials',
    url: {
      DEFAULT: `${PREFIX_GUIDES_URL}world-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      ASIA: `${PREFIX_GUIDES_URL}asia-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      DE: `${PREFIX_GUIDES_URL}de-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      ES: `${PREFIX_GUIDES_URL}es-es-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      IE: `${PREFIX_GUIDES_URL}en-ie-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      IT: `${PREFIX_GUIDES_URL}it-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      PL: `${PREFIX_GUIDES_URL}pl-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      PT: `${PREFIX_GUIDES_URL}pt-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      GB: `${PREFIX_GUIDES_URL}en-gb-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      CA: `${PREFIX_GUIDES_URL}en-ca-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      QC: `${PREFIX_GUIDES_URL}fr-ca-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      MA: `${PREFIX_GUIDES_URL}fr-ma-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      SN: `${PREFIX_GUIDES_URL}fr-sn-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      TN: `${PREFIX_GUIDES_URL}fr-tn-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      AU: `${PREFIX_GUIDES_URL}en-au-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      SG: `${PREFIX_GUIDES_URL}en-sg-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      FR: `${PREFIX_GUIDES_URL}fr-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      WE: `${PREFIX_GUIDES_URL}world-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      WS: `${PREFIX_GUIDES_URL}es-documentation-bare-metal-cloud-virtual-private-servers-tutorials${SUFFIX_URL_TUTORIALS}`,
      US:
        'https://support.us.ovhcloud.com/hc/en-us/categories/360001903679-Virtual-Private-Servers',
    },
  },
];

export default {
  VPS_GUIDES,
};
