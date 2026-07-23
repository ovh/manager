import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLocations } from '@/data/api/locations/locations.requests';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { Location, LocationSpecificType, LocationType } from '@/types/Location.type';

import RegionSelector from './RegionSelector.component';

vi.mock('@/data/api/locations/locations.requests');

const mockedGetLocations = vi.mocked(getLocations);

const buildLocation = (name: string, cityName: string): Location => ({
  name,
  code: name.slice(-3).toUpperCase(),
  cityName,
  cityCode: name.slice(-3).toUpperCase(),
  countryCode: 'FR',
  countryName: 'France',
  geographyName: 'Europe',
  geographyCode: 'EU',
  availabilityZones: [],
  type: LocationType.REGION_3_AZ,
  specificType: LocationSpecificType.STANDARD,
});

const LOCATIONS = [
  buildLocation('eu-west-par', 'Paris'),
  buildLocation('eu-west-gra', 'Gravelines'),
  buildLocation('eu-west-rbx', 'Roubaix'),
  buildLocation('eu-west-sbg', 'Strasbourg'),
  buildLocation('eu-west-lim', 'Limburg'),
];

const showMoreButton = (container: HTMLElement) =>
  container.querySelector('ods-button[label="region.show_more"]');

beforeEach(() => {
  mockedGetLocations.mockResolvedValue(LOCATIONS);
});

describe('RegionSelector', () => {
  it("n'affiche que les 3 premières localisations avant le « voir plus »", async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected={null} onSelect={vi.fn()} />,
    );

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
    // Le badge ODS expose son libellé via l'attribut `label`, pas comme texte enfant.
    expect(container.querySelector('ods-badge[label="eu-west-par"]')).toBeInTheDocument();
    expect(container.querySelector('ods-badge[label="eu-west-lim"]')).not.toBeInTheDocument();
  });

  it('déplie toutes les localisations au clic sur « voir plus », puis les replie', async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected={null} onSelect={vi.fn()} />,
    );

    await waitFor(() => expect(showMoreButton(container)).toBeInTheDocument());
    fireEvent.click(showMoreButton(container) as Element);

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(LOCATIONS.length));
    const showLess = container.querySelector('ods-button[label="region.show_less"]');
    expect(showLess).toBeInTheDocument();

    fireEvent.click(showLess as Element);
    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
  });

  it('garde la localisation sélectionnée visible même repliée', async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected="eu-west-lim" onSelect={vi.fn()} />,
    );

    await waitFor(() =>
      expect(container.querySelector('ods-badge[label="eu-west-lim"]')).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByRole('radio', { checked: true })).toBeInTheDocument();
  });

  it('remonte le nom de la localisation cliquée', async () => {
    const onSelect = vi.fn();
    await renderWithProviders(<RegionSelector selected={null} onSelect={onSelect} />);

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
    fireEvent.click(screen.getAllByRole('radio')[1] as Element);

    expect(onSelect).toHaveBeenCalledWith('eu-west-gra');
  });

  it("affiche un message d'erreur quand le référentiel est indisponible", async () => {
    mockedGetLocations.mockRejectedValue(new Error('boom'));

    const { container } = await renderWithProviders(
      <RegionSelector selected={null} onSelect={vi.fn()} />,
    );

    await waitFor(() => expect(container.querySelector('ods-message')).toBeInTheDocument());
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });
});
