import React from 'react';

import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OnboardingHighlights from './OnboardingHighlights.component';

describe('OnboardingHighlights', () => {
  it('renders the compatibility platform badges when key is "compatibility"', async () => {
    const { container } = await renderWithProviders(
      <OnboardingHighlights keys={['compatibility']} />,
    );

    expect(container.querySelector('ods-badge[label="VMware"]')).toBeInTheDocument();
    expect(container.querySelector('ods-badge[label="Windows"]')).toBeInTheDocument();
    expect(container.querySelector('ods-badge[label="Linux"]')).toBeInTheDocument();
    expect(container.querySelector('ods-badge[label="NAS"]')).toBeInTheDocument();
  });

  it('renders a plain text highlight when key is neither "compatibility" nor "pricing"', async () => {
    const { container } = await renderWithProviders(
      <OnboardingHighlights keys={['storage_included']} />,
    );

    expect(container.textContent).toContain('500 Go offerts avec votre licence');
    expect(container.querySelector('ods-badge')).not.toBeInTheDocument();
  });

  it('delegates the "pricing" key to OnboardingPricingHighlight', async () => {
    const { container } = await renderWithProviders(<OnboardingHighlights keys={['pricing']} />);

    // Pas de catalogue mocké dans ce test : OnboardingPricingHighlight reste en chargement.
    expect(container.querySelector('ods-skeleton')).toBeInTheDocument();
  });
});
