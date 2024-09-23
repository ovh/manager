import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export type TGuide = {
  id: string;
  links: Partial<Record<OvhSubsidiary, string>>;
};

const HELP_OVH_BASE_URL = 'https://help.ovhcloud.com/csm';
const SUPPORT_US_OVH_BASE_URL =
  'https://support.us.ovhcloud.com/hc/en-us/articles';

export const GUIDES: TGuide[] = [
  {
    id: 'create_instance',
    links: {
      DEFAULT: `${HELP_OVH_BASE_URL}/en-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051009`,
      DE: `${HELP_OVH_BASE_URL}/de-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051002`,
      ASIA: `${HELP_OVH_BASE_URL}/asia-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0038732`,
      AU: `${HELP_OVH_BASE_URL}/en-au-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051007`,
      CA: `${HELP_OVH_BASE_URL}/en-ca-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051008`,
      GB: `${HELP_OVH_BASE_URL}/en-gb-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051017`,
      IE: `${HELP_OVH_BASE_URL}/en-ie-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051014`,
      SG: `${HELP_OVH_BASE_URL}/en-sg-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051004`,
      ES: `${HELP_OVH_BASE_URL}/es-es-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051005`,
      WS: `${HELP_OVH_BASE_URL}/es-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051006`,
      QC: `${HELP_OVH_BASE_URL}/fr-ca-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051013`,
      FR: `${HELP_OVH_BASE_URL}/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011`,
      IT: `${HELP_OVH_BASE_URL}/it-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051025`,
      PL: `${HELP_OVH_BASE_URL}/pl-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051024`,
      PT: `${HELP_OVH_BASE_URL}/pt-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051015`,
      US: `${SUPPORT_US_OVH_BASE_URL}/360002245164-How-to-Create-and-Connect-a-Public-Cloud-Instance`,
    },
  },
  {
    id: 'post_install_script',
    links: {
      ASIA: `${HELP_OVH_BASE_URL}/asia-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050910`,
      AU: `${HELP_OVH_BASE_URL}/en-au-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0038632`,
      CA: `${HELP_OVH_BASE_URL}/en-ca-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050911`,
      GB: `${HELP_OVH_BASE_URL}/en-gb-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050914`,
      SG: `${HELP_OVH_BASE_URL}/en-sg-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050913`,
      DEFAULT: `${HELP_OVH_BASE_URL}/en-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050912`,
      QC: `${HELP_OVH_BASE_URL}/fr-ca-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050923`,
      FR: `${HELP_OVH_BASE_URL}/fr-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050924`,
      IT: `${HELP_OVH_BASE_URL}/it-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050916`,
      PL: `${HELP_OVH_BASE_URL}/pl-public-cloud-compute-launch-script-at-instance-creation?id=kb_article_view&sysparm_article=KB0050919`,
      US: `${SUPPORT_US_OVH_BASE_URL}/19905625883923-Getting-Started-with-the-OpenStack-API`,
    },
  },
  {
    id: 'back_up_instance',
    links: {
      DE: `${HELP_OVH_BASE_URL}/de-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051161`,
      ASIA: `${HELP_OVH_BASE_URL}/asia-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051147`,
      AU: `${HELP_OVH_BASE_URL}/en-au-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051148`,
      CA: `${HELP_OVH_BASE_URL}/en-ca-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051149`,
      GB: `${HELP_OVH_BASE_URL}/en-gb-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0038893`,
      IE: `${HELP_OVH_BASE_URL}/en-ie-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051157`,
      SG: `${HELP_OVH_BASE_URL}/en-sg-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051158`,
      DEFAULT: `${HELP_OVH_BASE_URL}/en-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051162`,
      ES: `${HELP_OVH_BASE_URL}/es-es-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051152`,
      WS: `${HELP_OVH_BASE_URL}/es-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051153`,
      QC: `${HELP_OVH_BASE_URL}/fr-ca-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051154`,
      FR: `${HELP_OVH_BASE_URL}/fr-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051155`,
      IT: `${HELP_OVH_BASE_URL}/it-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051165`,
      PL: `${HELP_OVH_BASE_URL}/pl-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051167`,
      PT: `${HELP_OVH_BASE_URL}/pt-public-cloud-compute-back-up-instance?id=kb_article_view&sysparm_article=KB0051159`,
      US: `${SUPPORT_US_OVH_BASE_URL}/4460743125395-How-to-Back-Up-a-Public-Cloud-Instance`,
    },
  },
  {
    id: 'instance_introduction',
    links: {
      ASIA: `${HELP_OVH_BASE_URL}/asia-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050909`,
      AU: `${HELP_OVH_BASE_URL}/en-au-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050907`,
      CA: `${HELP_OVH_BASE_URL}/en-ca-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050908`,
      GB: `${HELP_OVH_BASE_URL}/en-gb-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0038620`,
      IE: `${HELP_OVH_BASE_URL}/en-ie-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050902`,
      SG: `${HELP_OVH_BASE_URL}/en-sg-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050899`,
      DEFAULT: `${HELP_OVH_BASE_URL}/en-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050915`,
      QC: `${HELP_OVH_BASE_URL}/fr-ca-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050917`,
      FR: `${HELP_OVH_BASE_URL}/fr-public-cloud-compute-glossary?id=kb_article_view&sysparm_article=KB0050903`,
      US: `${SUPPORT_US_OVH_BASE_URL}/21740390395283-Public-Cloud-Glossary`,
    },
  },
];
