import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LOCATION_DEFINITIONS } from '@/data/locations.data';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import RegionSelector from './RegionSelector.component';

const LOCATION_COUNT = LOCATION_DEFINITIONS.length;
const lastLocationName = LOCATION_DEFINITIONS[LOCATION_COUNT - 1]!.name;

const showMoreButton = (container: HTMLElement) =>
  container.querySelector('ods-button[label^="Voir plus"]');

describe('RegionSelector', () => {
  it("n'affiche que les 3 premières localisations avant le « voir plus »", async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected={null} onSelect={vi.fn()} />,
    );

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
    // Le badge ODS expose son libellé via l'attribut `label`, pas comme texte enfant.
    expect(
      container.querySelector(`ods-badge[label="${LOCATION_DEFINITIONS[0]!.name}"]`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`ods-badge[label="${lastLocationName}"]`),
    ).not.toBeInTheDocument();
  });

  it('déplie toutes les localisations au clic sur « voir plus », puis les replie', async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected={null} onSelect={vi.fn()} />,
    );

    await waitFor(() => expect(showMoreButton(container)).toBeInTheDocument());
    fireEvent.click(showMoreButton(container) as Element);

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(LOCATION_COUNT));
    const showLess = container.querySelector('ods-button[label="Voir moins"]');
    expect(showLess).toBeInTheDocument();

    fireEvent.click(showLess as Element);
    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
  });

  it('garde la localisation sélectionnée visible même repliée', async () => {
    const { container } = await renderWithProviders(
      <RegionSelector selected={lastLocationName} onSelect={vi.fn()} />,
    );

    await waitFor(() =>
      expect(container.querySelector(`ods-badge[label="${lastLocationName}"]`)).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByRole('radio', { checked: true })).toBeInTheDocument();
  });

  it('remonte le nom de la localisation cliquée', async () => {
    const onSelect = vi.fn();
    await renderWithProviders(<RegionSelector selected={null} onSelect={onSelect} />);

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(3));
    fireEvent.click(screen.getAllByRole('radio')[1] as Element);

    expect(onSelect).toHaveBeenCalledWith(LOCATION_DEFINITIONS[1]!.name);
  });
});
