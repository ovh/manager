import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import VaultPriceCell from './VaultPriceCell.component';

describe('VaultPriceCell', () => {
  it('renders the included badge when the storage price is zero', async () => {
    const { container } = await renderWithProviders(
      <VaultPriceCell storagePriceValue={0} storagePriceText="0,00 €" />,
    );
    // `label` est un attribut de l'élément custom `ods-badge`, pas un nœud de texte.
    expect(container.querySelector('ods-badge[label="Inclus"]')).toBeInTheDocument();
  });

  it('renders the formatted price text when it is defined and non-zero', async () => {
    await renderWithProviders(<VaultPriceCell storagePriceValue={5000000} storagePriceText="0,05 €" />);
    expect(screen.getByText('0,05 €')).toBeInTheDocument();
  });

  it('renders the empty value placeholder when neither value nor text is defined', async () => {
    await renderWithProviders(<VaultPriceCell />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
