import { buildTranslationManager } from '../../../utils/translation-helper';

const translationLoaders = {
  de_DE: () => import('./Messages_de_DE.json'),
  en_GB: () => import('./Messages_en_GB.json'),
  es_ES: () => import('./Messages_es_ES.json'),
  fr_CA: () => import('./Messages_fr_CA.json'),
  fr_FR: () => import('./Messages_fr_FR.json'),
  it_IT: () => import('./Messages_it_IT.json'),
  pl_PL: () => import('./Messages_pl_PL.json'),
  pt_PT: () => import('./Messages_pt_PT.json'),
};

buildTranslationManager(translationLoaders, 'guide-button');
