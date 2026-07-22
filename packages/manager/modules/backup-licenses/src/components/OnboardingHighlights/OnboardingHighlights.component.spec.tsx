import React from 'react';

import { screen } from '@testing-library/react';
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

  it('renders a plain text highlight when key is not "compatibility"', async () => {
    const { container } = await renderWithProviders(<OnboardingHighlights keys={['pricing']} />);

    expect(screen.getByText('highlights.pricing')).toBeInTheDocument();
    expect(container.querySelector('ods-badge')).not.toBeInTheDocument();
  });
});
