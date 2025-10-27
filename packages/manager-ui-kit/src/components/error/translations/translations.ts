import type { Resource } from 'i18next';

import { buildTranslationManager } from '@/commons/utils/TranslationHelper';

const translationLoaders: Record<string, () => Promise<{ default: Resource }>> = {
  de_DE: () => import('./Messages_de_DE.json') as unknown as Promise<{ default: Resource }>,
  en_GB: () => import('./Messages_en_GB.json') as unknown as Promise<{ default: Resource }>,
  es_ES: () => import('./Messages_es_ES.json') as unknown as Promise<{ default: Resource }>,
  fr_CA: () => import('./Messages_fr_CA.json') as unknown as Promise<{ default: Resource }>,
  fr_FR: () => import('./Messages_fr_FR.json') as unknown as Promise<{ default: Resource }>,
  it_IT: () => import('./Messages_it_IT.json') as unknown as Promise<{ default: Resource }>,
  pl_PL: () => import('./Messages_pl_PL.json') as unknown as Promise<{ default: Resource }>,
  pt_PT: () => import('./Messages_pt_PT.json') as unknown as Promise<{ default: Resource }>,
};

buildTranslationManager(translationLoaders, 'error');
