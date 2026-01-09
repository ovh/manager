import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import i18n from 'i18next';
import { describe, expect } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useCountries } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useCountries', () => {
  const mockedCountriesFr = {
    country_AL: 'Albanie',
    country_FR: 'France',
    country_ZA: 'Afrique Du Sud',
    country_BE: 'Belgique',
    country_AF: 'Afghanistan',
  };

  const mockedCountriesEn = {
    country_AF: 'Afghanistan',
    country_FR: 'France',
    country_ZA: 'South Africa',
    country_AL: 'Albania',
    country_BE: 'Belgium',
  };

  beforeEach(() => {
    i18n.addResourceBundle('fr', NAMESPACES.COUNTRIES, mockedCountriesFr);
    i18n.addResourceBundle('en', NAMESPACES.COUNTRIES, mockedCountriesEn);
  });
  it('should sorts countries in french', () => {
    i18n.changeLanguage('fr');
    const { result } = renderHook(() => useCountries(), { wrapper });
    expect(result.current.countryKeys).toEqual([
      'country_AF',
      'country_ZA',
      'country_AL',
      'country_BE',
      'country_FR',
    ]);
  });
  it('should sorts countries in english', () => {
    i18n.changeLanguage('en');
    const { result } = renderHook(() => useCountries(), { wrapper });
    expect(result.current.countryKeys).toEqual([
      'country_AF',
      'country_AL',
      'country_BE',
      'country_FR',
      'country_ZA',
    ]);
  });
});
