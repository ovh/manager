import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import { initTestI18n } from '@/test-utils/i18ntest.utils';

import { useLocations } from './useLocations';

const renderUseLocations = async () => {
  const i18n = await initTestI18n();

  return renderHook(() => useLocations(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    ),
  });
};

describe('useLocations', () => {
  it('exposes the hardcoded catalog of 11 locations, translated in the current locale', async () => {
    const { result } = await renderUseLocations();

    await waitFor(() => expect(result.current).toHaveLength(11));
    expect(result.current.map(({ name }) => name)).toEqual([
      'eu-west-gra',
      'eu-west-rbx',
      'eu-west-sbg',
      'eu-west-lim',
      'eu-west-eri',
      'eu-central-waw',
      'ca-east-bhs',
      'ca-east-tor',
      'ap-southeast-sgp',
      'ap-southeast-syd',
      'ap-south-mum',
    ]);
  });

  it('resolves the city / country / geography labels from the shared referentials', async () => {
    const { result } = await renderUseLocations();

    const gravelines = result.current.find(({ name }) => name === 'eu-west-gra');
    expect(gravelines).toMatchObject({
      cityName: 'Gravelines',
      countryName: 'France',
      geographyName: "Europe de l'Ouest",
    });

    const mumbai = result.current.find(({ name }) => name === 'ap-south-mum');
    expect(mumbai).toMatchObject({
      cityName: 'Mumbai',
      countryName: 'Inde',
      geographyName: 'Asie Pacifique',
    });
  });
});
