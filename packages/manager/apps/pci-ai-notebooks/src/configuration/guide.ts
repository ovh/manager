import { Locale } from '@/hooks/useLocale';

export enum GuideSections {
  'cli' = 'cli',
  'ovhaiCli' = 'ovhai-cli',
  'users' = 'utilisateurs',
  'data' = 'donnees',
  'faq' = 'faq',
  'registres' = 'registres',
  'products' = 'produits-ia',
  'notebooks' = 'ai-notebooks',
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

export function getGlobalAIGuideLink(local: string) {
  return local === Locale.fr_FR || local === Locale.fr_CA
    ? 'https://docs.ovh.com/fr/publiccloud/ai/'
    : 'https://docs.ovh.com/gb/en/publiccloud/ai/';
}

export function getOnbordingTuto1Link(local: string) {
  return local === Locale.fr_FR || local === Locale.fr_CA
    ? 'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048247'
    : 'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-capabilities?id=kb_article_view&sysparm_article=KB0048238';
}
export function getOnbordingTuto2Link(local: string) {
  return local === Locale.fr_FR || local === Locale.fr_CA
    ? 'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274'
    : 'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048269';
}

export function getHowToManageDataInAIDocLink(local: string) {
  return local === Locale.fr_FR || local === Locale.fr_CA
    ? 'https://help.ovhcloud.com/csm/fr-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048274'
    : 'https://help.ovhcloud.com/csm/en-gb-public-cloud-ai-notebooks-definition?id=kb_article_view&sysparm_article=KB0048269';
}
