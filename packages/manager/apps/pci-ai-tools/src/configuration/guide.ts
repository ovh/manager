export enum GuideSections {
  'cli' = 'cli',
  'ovhaiCli' = 'ovhai-cli',
  'users' = 'utilisateurs',
  'data' = 'donnees',
  'faq' = 'faq',
  'registres' = 'registres',
  'products' = 'produits-ia',
  'notebooks' = 'ai-notebooks',
  'jobs' = 'ai-training',
  'apps' = 'ai-deploy',
}

export const notebookGuidesSections: GuideSections[] = [
  GuideSections.cli,
  GuideSections.data,
  GuideSections.faq,
  GuideSections.notebooks,
  GuideSections.ovhaiCli,
  GuideSections.products,
];

export const jobGuidesSections: GuideSections[] = [
  GuideSections.cli,
  GuideSections.data,
  GuideSections.faq,
  GuideSections.jobs,
  GuideSections.ovhaiCli,
  GuideSections.products,
];

export const appGuidesSections: GuideSections[] = [
  GuideSections.cli,
  GuideSections.data,
  GuideSections.faq,
  GuideSections.apps,
  GuideSections.ovhaiCli,
  GuideSections.products,
];

export const GUIDES = {
  GLOBAL_AI: {
    fr_FR: 'https://docs.ovh.com/fr/publiccloud/ai/',
    fr_CA: 'https://docs.ovh.com/fr/publiccloud/ai/',
    default: 'https://docs.ovh.com/gb/en/publiccloud/ai/',
  },
  NOTEBOOK_ONBOARDING_TUTO_1: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048247',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048247',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048238',
  },
  NOTEBOOK_ONBOARDING_TUTO_2: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048269',
  },
  JOB_ONBOARDING_TUTO_1: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-capabilities?id=kb_article_view&sysparm_article=KB0048434',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-capabilities?id=kb_article_view&sysparm_article=KB0048434',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-training-capabilities?id=kb_article_view&sysparm_article=KB0048420',
  },
  JOB_ONBOARDING_TUTO_2: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-submit-job?id=kb_article_view&sysparm_article=KB0048439',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-submit-job?id=kb_article_view&sysparm_article=KB0048439',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-training-submit-job?id=kb_article_view&sysparm_article=KB0048754',
  },
  APP_ONBOARDING_TUTO_1: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-capabilities?id=kb_article_view&sysparm_article=KB0047964',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-capabilities?id=kb_article_view&sysparm_article=KB0047964',
    default:
      'https://help.ovhcloud.com/csm/en-gb-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  },
  APP_ONBOARDING_TUTO_2: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-getting-started?id=kb_article_view&sysparm_article=KB0047991',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-getting-started?id=kb_article_view&sysparm_article=KB0047991',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-deploy-getting-started?id=kb_article_view&sysparm_article=KB0047971',
  },
  HOW_TO_MANAGE_DATA: {
    fr_FR: 'https://docs.ovh.com/fr/publiccloud/ai/data/',
    fr_CA: 'https://docs.ovh.com/fr/publiccloud/ai/data/',
    default: 'https://docs.ovh.com/gb/en/publiccloud/ai/data/',
  },
  HOW_TO_MANAGE_SCALING: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-apps-deployments?id=kb_article_view&sysparm_article=KB0048006',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-deploy-apps-deployments?id=kb_article_view&sysparm_article=KB0048006',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-deploy-apps-deployments?id=kb_article_view&sysparm_article=KB0047997',
  },
  HOW_TO_USE_CUSTOM_IMAGE: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-build-use-custom-image?id=kb_article_view&sysparm_article=KB0048520',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-training-build-use-custom-image?id=kb_article_view&sysparm_article=KB0048520',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-training-build-use-custom-image?id=kb_article_view&sysparm_article=KB0048515',
  },
};

export function getGuideUrl(
  guide: typeof GUIDES[keyof typeof GUIDES],
  locale: string,
): string {
  return guide[locale as keyof typeof guide] || guide.default;
}
