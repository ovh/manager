type GuideVariant =
  | 'fr'
  | 'fr-ca'
  | 'de'
  | 'en-gb'
  | 'en-ie'
  | 'en-ca'
  | 'en-in'
  | 'en-sg'
  | 'asia'
  | 'it'
  | 'pl'
  | 'pt'
  | 'es-es';

const articleUrl = (slug: string, article: string) =>
  `https://help.ovhcloud.com/csm/${slug}?id=kb_article_view&sysparm_article=${article}`;

export const RECORD_GUIDE_LINKS: Record<string, Partial<Record<GuideVariant, string>>> = {
  A: {
    fr: articleUrl('fr-dns-create-a-record', 'KB0067694'),
    'fr-ca': articleUrl('fr-ca-dns-create-a-record', 'KB0067692'),
    de: articleUrl('de-dns-create-a-record', 'KB0067688'),
    'en-gb': articleUrl('en-gb-dns-create-a-record', 'KB0067683'),
    'en-ie': articleUrl('en-ie-dns-create-a-record', 'KB0067684'),
    'en-in': articleUrl('en-in-dns-create-a-record', 'KB0069733'),
    'en-sg': articleUrl('en-sg-dns-create-a-record', 'KB0067681'),
    asia: articleUrl('asia-dns-create-a-record', 'KB0067686'),
    it: articleUrl('it-dns-create-a-record', 'KB0067695'),
    pl: articleUrl('pl-dns-create-a-record', 'KB0067697'),
    pt: articleUrl('pt-dns-create-a-record', 'KB0067693'),
    'es-es': articleUrl('es-es-dns-create-a-record', 'KB0067680'),
  },
  AAAA: {
    fr: articleUrl('fr-dns-create-aaaa-record', 'KB0067712'),
    'fr-ca': articleUrl('fr-ca-dns-create-aaaa-record', 'KB0067706'),
    de: articleUrl('de-dns-create-aaaa-record', 'KB0067704'),
    'en-gb': articleUrl('en-gb-dns-create-aaaa-record', 'KB0067700'),
    'en-ie': articleUrl('en-ie-dns-create-aaaa-record', 'KB0067711'),
    'en-ca': articleUrl('en-ca-dns-create-aaaa-record', 'KB0067701'),
    'en-in': articleUrl('en-in-dns-create-aaaa-record', 'KB0069731'),
    'en-sg': articleUrl('en-sg-dns-create-aaaa-record', 'KB0067708'),
    asia: articleUrl('asia-dns-create-aaaa-record', 'KB0067699'),
    it: articleUrl('it-dns-create-aaaa-record', 'KB0067710'),
    pl: articleUrl('pl-dns-create-aaaa-record', 'KB0067713'),
    pt: articleUrl('pt-dns-create-aaaa-record', 'KB0067707'),
    'es-es': articleUrl('es-es-dns-create-aaaa-record', 'KB0067705'),
  },
  TXT: {
    fr: articleUrl('fr-dns-create-txt-record', 'KB0071062'),
    'fr-ca': articleUrl('fr-ca-dns-create-txt-record', 'KB0071050'),
    de: articleUrl('de-dns-create-txt-record', 'KB0071052'),
    'en-gb': articleUrl('en-gb-dns-create-txt-record', 'KB0071061'),
    'en-ie': articleUrl('en-ie-dns-create-txt-record', 'KB0071058'),
    'en-ca': articleUrl('en-ca-dns-create-txt-record', 'KB0071065'),
    'en-in': articleUrl('en-in-dns-create-txt-record', 'KB0071053'),
    'en-sg': articleUrl('en-sg-dns-create-txt-record', 'KB0071063'),
    asia: articleUrl('fr-dns-create-txt-record', 'KB0071062'),
    it: articleUrl('it-dns-create-txt-record', 'KB0071054'),
    pl: articleUrl('pl-dns-create-txt-record', 'KB0071057'),
    pt: articleUrl('pt-dns-create-txt-record', 'KB0071055'),
    'es-es': articleUrl('es-es-dns-create-txt-record', 'KB0071056'),
  },
  MX: {
    fr: articleUrl('fr-dns-configure-mx-dns-zone', 'KB0051707'),
    'fr-ca': articleUrl('fr-ca-dns-configure-mx-dns-zone', 'KB0051706'),
    de: articleUrl('de-dns-configure-mx-dns-zone', 'KB0039624'),
    'en-gb': articleUrl('en-gb-dns-configure-mx-dns-zone', 'KB0051697'),
    'en-ie': articleUrl('en-ie-dns-configure-mx-dns-zone', 'KB0051691'),
    'en-ca': articleUrl('en-ca-dns-configure-mx-dns-zone', 'KB0051696'),
    'en-in': articleUrl('en-in-dns-configure-mx-dns-zone', 'KB0069750'),
    'en-sg': articleUrl('en-sg-dns-configure-mx-dns-zone', 'KB0051693'),
    asia: articleUrl('asia-dns-configure-mx-dns-zone', 'KB0051688'),
    it: articleUrl('it-dns-configure-mx-dns-zone', 'KB0051708'),
    pl: articleUrl('pl-dns-configure-mx-dns-zone', 'KB0051700'),
    pt: articleUrl('pt-dns-configure-mx-dns-zone', 'KB0051702'),
    'es-es': articleUrl('es-es-dns-configure-mx-dns-zone', 'KB0051698'),
  },
};

const SINGLE_VARIANT_LANGUAGES: Record<string, GuideVariant> = {
  de: 'de',
  es: 'es-es',
  it: 'it',
  pl: 'pl',
  pt: 'pt',
};

const FRENCH_CANADIAN_SUBSIDIARIES = ['QC', 'CA'];

const ENGLISH_VARIANT_BY_SUBSIDIARY: Record<string, GuideVariant> = {
  GB: 'en-gb',
  IE: 'en-ie',
  NL: 'en-ie',
  IN: 'en-in',
  SG: 'en-sg',
  ASIA: 'asia',
  CA: 'en-ca',
};

const FALLBACK_VARIANT: GuideVariant = 'fr-ca';

export const getGuideVariant = (locale: string, subsidiary: string): GuideVariant => {
  const [language, region] = locale.split(/[_-]/);
  const normalizedLanguage = language?.toLowerCase() ?? '';

  if (SINGLE_VARIANT_LANGUAGES[normalizedLanguage]) {
    return SINGLE_VARIANT_LANGUAGES[normalizedLanguage];
  }

  if (normalizedLanguage === 'fr') {
    return region?.toUpperCase() === 'CA' || FRENCH_CANADIAN_SUBSIDIARIES.includes(subsidiary)
      ? 'fr-ca'
      : 'fr';
  }

  return ENGLISH_VARIANT_BY_SUBSIDIARY[subsidiary] ?? 'en-gb';
};

export const getRecordGuideUrl = (
  recordType: string,
  locale: string,
  subsidiary: string,
): string | undefined => {
  const links = RECORD_GUIDE_LINKS[recordType];
  if (!links) {
    return undefined;
  }
  return links[getGuideVariant(locale, subsidiary)] ?? links[FALLBACK_VARIANT];
};
