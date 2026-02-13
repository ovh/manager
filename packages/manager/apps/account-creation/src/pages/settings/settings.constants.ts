import { Subsidiary } from '@ovh-ux/manager-config';

export const WEBSITE_LABEL_BY_LOCALE = {
  'fr-FR': 'OVHcloud France (Français)',
  'es-ES': 'OVHcloud España (Español)',
  'en-IE': 'OVHcloud Ireland (English)',
  'pt-PT': 'OVHcloud Portugal (Português)',
  'de-DE': 'OVHcloud Deutschland (Deutsch)',
  'nl-NL': 'OVHcloud Nederland (Nederlands)',
  'fr-SN': 'OVHcloud Sénégal (Français)',
  'it-IT': 'OVHcloud Italia (Italiano)',
  'en-GB': 'OVHcloud United-Kingdom (English)',
  'ar-MA': 'OVHcloud Maroc (Français)',
  'pl-PL': 'OVHcloud Polska (Polski)',
  'fr-TN': 'OVHcloud Tunisie (Français)',
  'en-CA': 'OVHcloud Canada (English)',
  'en-AU': 'OVHcloud Australia (English)',
  'en-SG': 'OVHcloud Singapore (English)',
  'zh-SG': 'OVHcloud 新加坡 (中文)',
  'fr-CA': 'OVHcloud Canada (Français)',
  'hi-IN': 'OVHcloud भारत (हिंदी)',
  'en-IN': 'OVHcloud India (English)',
  'en-US': 'OVHcloud United States (English)',
};

export const WEBSITE_LABEL_BY_LOCALE_OVERWRITES: Partial<Record<
  Subsidiary,
  Record<string, string>
>> = {
  WS: {
    'es-ES': 'OVHcloud World (Español)',
  },
  WE: {
    'en-CA': 'OVHcloud World (English)',
  },
};

export const DEFAULT_REDIRECT_URL = 'https://ovhcloud.com/';
