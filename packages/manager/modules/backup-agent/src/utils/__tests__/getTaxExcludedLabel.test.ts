import { describe, expect, it } from 'vitest';

import { getTaxExcludedLabel } from '@/utils/getTaxExcludedLabel';

describe('getTaxExcludedLabel test suite', () => {
  it.each([
    ['de_DE', 'zzgl. MwSt.'],
    ['en_GB', 'ex. VAT'],
    ['es_ES', '+ IVA'],
    ['fr_CA', 'HT'],
    ['fr_FR', 'HT'],
    ['it_IT', '+IVA'],
    ['pl_PL', 'netto'],
    ['pt_PT', '+ IVA'],
  ])('returns the VAT label of locale %s', (locale, expected) => {
    expect(getTaxExcludedLabel(locale, 'FR')).toBe(expected);
  });

  it.each([
    ['de_DE', 'ohne GST'],
    ['en_GB', 'ex. GST'],
    ['es_ES', '+ GST'],
    ['fr_FR', 'ex. GST'],
    ['it_IT', '+GST'],
    ['pl_PL', 'bez GST'],
    ['pt_PT', 'ex. GST'],
  ])('returns the GST label of locale %s', (locale, expected) => {
    expect(getTaxExcludedLabel(locale, 'SG')).toBe(expected);
  });

  it.each(['ASIA', 'AU', 'IN', 'SG'])('returns the GST label for subsidiary %s', (subsidiary) => {
    expect(getTaxExcludedLabel('en_GB', subsidiary)).toBe('ex. GST');
  });

  it('returns the tax label for subsidiary US', () => {
    expect(getTaxExcludedLabel('en_GB', 'US')).toBe('ex. tax');
  });

  it.each(['FR', 'GB', 'DE', 'ES', 'IT', 'PL', 'PT', 'CA', 'QC', 'WE', 'WS'])(
    'returns the VAT label for subsidiary %s',
    (subsidiary) => {
      expect(getTaxExcludedLabel('en_GB', subsidiary)).toBe('ex. VAT');
    },
  );

  it('falls back to the english labels for an unknown locale', () => {
    expect(getTaxExcludedLabel('nl_NL', 'US')).toBe('ex. tax');
  });

  it('falls back to the VAT label for an unknown subsidiary', () => {
    expect(getTaxExcludedLabel('fr_FR', 'XX')).toBe('HT');
  });

  it('falls back to the english VAT label without any argument', () => {
    expect(getTaxExcludedLabel()).toBe('ex. VAT');
  });
});
