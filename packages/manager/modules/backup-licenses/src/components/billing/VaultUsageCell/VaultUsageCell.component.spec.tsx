import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import VaultUsageCell from './VaultUsageCell.component';

describe('VaultUsageCell', () => {
  it('renders the quantity followed by the GB unit when nothing is included', async () => {
    await renderWithProviders(<VaultUsageCell quantityGb={7} />);
    expect(screen.getByText('7 unit_size_GB')).toBeInTheDocument();
  });

  it('renders the quantity out of the included storage on a bundle vault', async () => {
    await renderWithProviders(<VaultUsageCell quantityGb={487} includedStorageGb={500} />);
    expect(screen.getByText('487 / 500 unit_size_GB inclus')).toBeInTheDocument();
  });

  it('renders the empty value placeholder when the quantity is undefined', async () => {
    await renderWithProviders(<VaultUsageCell />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
