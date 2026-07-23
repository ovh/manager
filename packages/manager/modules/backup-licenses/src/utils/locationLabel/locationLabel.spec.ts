import { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';

import { Location, LocationSpecificType, LocationType } from '@/types/Location.type';

import { formatLocationTitle, getFlagEmoji } from './locationLabel';

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
