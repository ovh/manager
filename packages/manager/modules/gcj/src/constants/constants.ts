import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { Region } from '@ovh-ux/manager-config';
import { PolicyLinks } from '../types/links.type';

export const LegalPolicyLinkByLanguage: PolicyLinks = {
  DEFAULT: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  ASIA: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
  AU: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
  CA: {
    en: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
    fr: 'https://www.ovhcloud.com/fr-ca/terms-and-conditions/privacy-policy/',
  },
  CZ: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  DE: 'https://www.ovhcloud.com/de/terms-and-conditions/privacy-policy/',
  ES: 'https://www.ovhcloud.com/es-es/terms-and-conditions/privacy-policy/',
  EU: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  FI: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  FR: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  GB: 'https://www.ovhcloud.com/en-gb/terms-and-conditions/privacy-policy/',
  IE: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  IN: 'https://www.ovhcloud.com/en-in/terms-and-conditions/privacy-policy/',
  IT: 'https://www.ovhcloud.com/it/terms-and-conditions/privacy-policy/',
  LT: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  LTE: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  MA: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  NL: 'https://www.ovhcloud.com/nl/terms-and-conditions/privacy-policy/',
  PL: 'https://www.ovhcloud.com/pl/terms-and-conditions/privacy-policy/',
  PT: 'https://www.ovhcloud.com/pt/terms-and-conditions/privacy-policy/',
  QC: 'https://www.ovhcloud.com/fr-ca/terms-and-conditions/privacy-policy/',
  SG: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
  SN: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  TN: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  US: 'https://us.ovhcloud.com/legal/privacy-policy/',
  WE: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
  WS: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
};

export const DEFAULT_SUB_BY_REGION: Record<Region, OvhSubsidiary> = {
  EU: OvhSubsidiary.IE,
  CA: OvhSubsidiary.CA,
  US: OvhSubsidiary.US,
};

export const MORE_INFO_LINK = {
  FR:
    'https://www.ovh.com/fr/support/documents_legaux/politique_cookies_ovh.xml',
  GB: 'https://www.ovh.co.uk/support/termsofservice/cookies_ovh.xml',
  IE: 'https://www.ovh.ie/support/termsofservice/cookies_ovh.xml',
  DE: 'https://www.ovh.de/support/agb/cookies_ovh.xml',
  ES: 'https://www.ovh.es/soporte/documentos_legales/cookies_ovh.xml',
  IT: 'https://www.ovh.it/supporto/documenti_legali/cookies_ovh.xml',
  NL: 'https://www.ovh.nl/support/algemene_voorwaarden/cookies_ovh.xml',
  PL: 'https://www.ovh.pl/pomoc/dokumenty/cookies_ovh.xml',
  PT: 'https://www.ovh.pt/suporte/documentos_legais/cookies_ovh.xml',
  SN: 'https://www.ovh.sn/support/documents_legaux/politique_cookies_ovh.xml',
  TN:
    'https://www.ovh.com/tn/support/documents_legaux/politique_cookies_ovh.xml',
  MA:
    'https://www.ovh.com/ma/support/documents_legaux/politique_cookies_ovh.xml',
  QC: 'https://www.ovh.com/ca/fr/support/documents_legaux/cookies_ovh.xml',
  CA: 'https://www.ovh.com/ca/en/support/termsofservice/cookies_ovh.xml',
  WE: 'https://www.ovh.com/world/support/termsofservice/cookies_ovh.xml',
  WS: 'https://www.ovh.com/world/es/soporte/documentos_legales/cookies_ovh.xml',
  AU: 'https://www.ovh.com.au/support/termsofservice/cookies_ovh.xml',
  SG: 'https://www.ovh.com/sg/support/termsofservice/cookies_ovh.xml',
  ASIA: 'https://www.ovh.com/asia/support/termsofservice/cookies_ovh.xml',
  IN: 'https://www.ovhcloud.com/en-in/support/termsofservice/cookies_ovh.xml',
  DEFAULT: 'https://www.ovh.ie/support/termsofservice/cookies_ovh.xml',
};

export const SMALL_DEVICE_MAX_SIZE = '30em';
