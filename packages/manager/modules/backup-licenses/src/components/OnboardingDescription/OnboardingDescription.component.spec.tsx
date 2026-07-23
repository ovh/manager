import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OnboardingDescription from './OnboardingDescription.component';

describe('OnboardingDescription', () => {
  it('renders the subtitle and the description', async () => {
    await renderWithProviders(<OnboardingDescription />);

    expect(
      screen.getByText('Perdre une donnée critique ne devrait jamais être une option.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sauvegardez, restaurez et répliquez vos workloads critiques en toute confiance. Déployez votre socle Veeam Backup & Replication avec les licences Enterprise Plus incluses par OVHcloud.',
      ),
    ).toBeInTheDocument();
  });
});
