export const enum Region {
  US = 'US',
  CA = 'CA',
  EU = 'EU',
}

export const enum CountryCode {
  US = 'US',
  CA = 'CA',
  FR = 'FR',
  GB = 'GB',
  ES = 'ES',
  PL = 'PL',
  PT = 'PT',
  IT = 'IT',
  DE = 'DE',
}
export type LangId = 'nl' | 'fr' | 'en' | 'de' | 'es' | 'it' | 'pl' | 'pt';

export interface KeyPairName {
  name: string;
  key: string;
}

export type PreferredRegionByLang = {
  [langKey in LangId]?: { [regionKey in Region]?: CountryCode };
};

export interface OVHLanguages {
  available: Array<KeyPairName>;
  defaultLoc: string;
  fallback: string;
  preferred: PreferredRegionByLang;
}
