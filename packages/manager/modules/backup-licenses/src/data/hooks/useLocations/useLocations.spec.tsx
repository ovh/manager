import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { getLocations } from '@/data/api/locations/locations.requests';
import { initTestI18n } from '@/test-utils/i18ntest.utils';
import { createQueryClientTest } from '@/test-utils/renderWithProviders';
import { LocationSpecificType, LocationType } from '@/types/Location.type';

import { useLocations } from './useLocations';

vi.mock('@/data/api/locations/locations.requests');

const mockedGetLocations = vi.mocked(getLocations);

const parisLocation = {
  name: 'eu-west-par',
  code: 'PAR',
  cityName: 'Paris',
  cityCode: 'PAR',
  countryCode: 'FR',
  countryName: 'France',
  geographyName: 'Europe',
  geographyCode: 'EU',
  availabilityZones: [],
  type: LocationType.REGION_3_AZ,
  specificType: LocationSpecificType.STANDARD,
};

const renderUseLocations = async () => {
  const i18n = await initTestI18n();
  const queryClient = createQueryClientTest();

  return renderHook(() => useLocations(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    ),
  });
};

describe('useLocations', () => {
  it('expose les localisations et demande les libellés dans la locale courante', async () => {
    mockedGetLocations.mockResolvedValue([parisLocation]);

    const { result } = await renderUseLocations();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([parisLocation]);
    expect(mockedGetLocations).toHaveBeenCalledWith('fr_FR');
  });

  it("remonte l'erreur quand l'appel échoue", async () => {
    mockedGetLocations.mockRejectedValue(new Error('boom'));

    const { result } = await renderUseLocations();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
