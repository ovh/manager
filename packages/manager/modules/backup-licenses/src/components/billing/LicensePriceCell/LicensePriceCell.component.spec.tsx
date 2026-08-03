import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import LicensePriceCell from './LicensePriceCell.component';

describe('LicensePriceCell', () => {
  it('renders the formatted license price text when defined', async () => {
    await renderWithProviders(<LicensePriceCell licensePriceText="4,90 €" />);
    expect(screen.getByText('4,90 €')).toBeInTheDocument();
  });

  it('renders the empty value placeholder when undefined', async () => {
    await renderWithProviders(<LicensePriceCell />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
