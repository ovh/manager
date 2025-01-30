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
}

export const allGuidesSections: GuideSections[] = [
  GuideSections.cli,
  GuideSections.data,
  GuideSections.faq,
  GuideSections.notebooks,
  GuideSections.ovhaiCli,
  GuideSections.products,
  GuideSections.notebooks,
];

export const GUIDES = {
  GLOBAL_AI: {
    fr_FR: 'https://docs.ovh.com/fr/publiccloud/ai/',
    fr_CA: 'https://docs.ovh.com/fr/publiccloud/ai/',
    default: 'https://docs.ovh.com/gb/en/publiccloud/ai/',
  },
  ONBOARDING_TUTO_1: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048247',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048247',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048238',
  },
  ONBOARDING_TUTO_2: {
    fr_FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274',
    fr_CA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274',
    default:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048269',
  },
  HOW_TO_MANAGE_DATA: {
    fr_FR: 'https://docs.ovh.com/fr/publiccloud/ai/data/',
    fr_CA: 'https://docs.ovh.com/fr/publiccloud/ai/data/',
    default: 'https://docs.ovh.com/gb/en/publiccloud/ai/data/',
  },
};

export function getGuideUrl(
  guide: typeof GUIDES[keyof typeof GUIDES],
  locale: string,
): string {
  return guide[locale as keyof typeof guide] || guide.default;
}
