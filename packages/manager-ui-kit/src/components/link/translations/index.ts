import {
  LocaleType,
  TranslationLoaderType,
  buildTranslationManager,
  resolveTranslationModule,
} from '@/commons/utils/TranslationHelper';

const translationLoaders = {
  de_DE: () => resolveTranslationModule(import('./Messages_de_DE.json')),
  en_GB: () => resolveTranslationModule(import('./Messages_en_GB.json')),
  es_ES: () => resolveTranslationModule(import('./Messages_es_ES.json')),
  fr_CA: () => resolveTranslationModule(import('./Messages_fr_CA.json')),
  fr_FR: () => resolveTranslationModule(import('./Messages_fr_FR.json')),
  it_IT: () => resolveTranslationModule(import('./Messages_it_IT.json')),
  pl_PL: () => resolveTranslationModule(import('./Messages_pl_PL.json')),
  pt_PT: () => resolveTranslationModule(import('./Messages_pt_PT.json')),
} satisfies Record<LocaleType, TranslationLoaderType>;

buildTranslationManager(translationLoaders, 'link' as const);
