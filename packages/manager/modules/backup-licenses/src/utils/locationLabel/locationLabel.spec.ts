import { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';

import { Location, LocationSpecificType, LocationType } from '@/types/Location.type';

import {
  formatCityOptionLabel,
  formatCountryTitle,
  formatLocationTitle,
  getFlagEmoji,
  selectCountries,
  selectLocationsByCountry,
} from './locationLabel';

const location: Location = {
  name: 'eu-west-par',
  code: 'PAR',
  cityName: 'Paris',
  cityCode: 'PAR',
  countryCode: 'FR',
  countryName: 'France',
  geographyName: 'Europe',
  geographyCode: 'EU',
  availabilityZones: ['eu-west-par-a'],
  type: LocationType.REGION_3_AZ,
  specificType: LocationSpecificType.STANDARD,
};

describe('getFlagEmoji', () => {
  it('dérive le drapeau du code pays ISO-2', () => {
    expect(getFlagEmoji('FR')).toBe('🇫🇷');
    expect(getFlagEmoji('de')).toBe('🇩🇪');
  });

  it('retourne une chaîne vide pour un code inexploitable', () => {
    expect(getFlagEmoji(undefined)).toBe('');
    expect(getFlagEmoji('FRA')).toBe('');
    expect(getFlagEmoji('F1')).toBe('');
  });
});

describe('formatLocationTitle', () => {
  it('compose le titre via la clé i18n dédiée', () => {
    const t = vi.fn(() => 'France – Paris') as unknown as TFunction;

    expect(formatLocationTitle(t, location)).toBe('France – Paris');
    expect(t).toHaveBeenCalledWith('region.card_title', { country: 'France', city: 'Paris' });
  });
});

describe('selectCountries', () => {
  it('déduplique les pays présents dans plusieurs localisations et trie par nom', () => {
    const paris = location;
    const gravelines: Location = { ...location, name: 'eu-west-gra', cityName: 'Gravelines' };
    const bhs: Location = {
      ...location,
      name: 'ca-east-bhs',
      cityName: 'Beauharnois',
      countryCode: 'CA',
      countryName: 'Canada',
    };

    expect(selectCountries([paris, gravelines, bhs])).toEqual([
      { countryCode: 'CA', countryName: 'Canada' },
      { countryCode: 'FR', countryName: 'France' },
    ]);
  });
});

describe('formatCountryTitle', () => {
  it('préfixe le nom du pays de son drapeau', () => {
    expect(formatCountryTitle({ countryCode: 'FR', countryName: 'France' })).toBe('🇫🇷 France');
  });

  it('omet le drapeau si le code pays est inexploitable', () => {
    expect(formatCountryTitle({ countryCode: '', countryName: 'Antarctique' })).toBe('Antarctique');
  });
});

describe('selectLocationsByCountry', () => {
  it('ne garde que les localisations du pays demandé, triées par ville', () => {
    const paris = location;
    const gravelines: Location = { ...location, name: 'eu-west-gra', cityName: 'Gravelines' };
    const bhs: Location = {
      ...location,
      name: 'ca-east-bhs',
      cityName: 'Beauharnois',
      countryCode: 'CA',
      countryName: 'Canada',
    };

    expect(selectLocationsByCountry([paris, gravelines, bhs], 'FR').map((l) => l.cityName)).toEqual(
      ['Gravelines', 'Paris'],
    );
  });

  it("ne modifie pas le tableau d'origine", () => {
    const paris = location;
    const gravelines: Location = { ...location, name: 'eu-west-gra', cityName: 'Gravelines' };
    const original = [paris, gravelines];

    selectLocationsByCountry(original, 'FR');

    expect(original).toEqual([paris, gravelines]);
  });
});

describe('formatCityOptionLabel', () => {
  it('suffixe le nom de la ville par le nom technique de la région', () => {
    expect(formatCityOptionLabel(location)).toBe('Paris (eu-west-par)');
  });

  it('distingue deux régions de la même ville', () => {
    const secondRegionInParis: Location = { ...location, name: 'eu-west-par-2' };

    expect(formatCityOptionLabel(location)).not.toBe(formatCityOptionLabel(secondRegionInParis));
  });
});
