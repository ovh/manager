import { enGB, fr, frCA, de, es, it, pl, pt } from 'date-fns/locale';

export const LOCALE_MAP = {
  enGB,
  fr,
  frCA,
  de,
  es,
  it,
  pl,
  pt,
} as const;

export type LocaleKey = keyof typeof LOCALE_MAP;
