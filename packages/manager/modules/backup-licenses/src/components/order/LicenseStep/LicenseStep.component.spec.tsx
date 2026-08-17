import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import LicenseStep from './LicenseStep.component';

describe('LicenseStep', () => {
  it('ne dévoile pas les cartes de niveau VDP quand Enterprise Plus est sélectionné', async () => {
    await renderWithProviders(
      <LicenseStep
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        onSelectFamily={vi.fn()}
        onSelectTier={vi.fn()}
      />,
    );

    expect(screen.queryByRole('radiogroup', { name: 'Niveau VDP' })).not.toBeInTheDocument();
  });

  it('dévoile les 3 cartes de niveau VDP quand Data Platform est sélectionné', async () => {
    await renderWithProviders(
      <LicenseStep
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        onSelectFamily={vi.fn()}
        onSelectTier={vi.fn()}
      />,
    );

    const tierGroup = screen.getByRole('radiogroup', { name: 'Niveau VDP' });
    expect(tierGroup.querySelectorAll('[role="radio"]')).toHaveLength(3);
  });

  it("ne dévoile aucune carte de niveau tant qu'aucune famille n'est sélectionnée", async () => {
    await renderWithProviders(
      <LicenseStep family={null} tier={null} onSelectFamily={vi.fn()} onSelectTier={vi.fn()} />,
    );

    expect(screen.queryByRole('radiogroup', { name: 'Niveau VDP' })).not.toBeInTheDocument();
  });

  it('désactive les cartes de famille quand familyDisabled est vrai', async () => {
    await renderWithProviders(
      <LicenseStep
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        onSelectFamily={vi.fn()}
        onSelectTier={vi.fn()}
        familyDisabled
      />,
    );

    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    familyGroup.querySelectorAll('[role="radio"]').forEach((radio) => expect(radio).toBeDisabled());
  });

  it('désactive les cartes de niveau VDP quand tierDisabled est vrai, sans toucher aux cartes de famille', async () => {
    await renderWithProviders(
      <LicenseStep
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        onSelectFamily={vi.fn()}
        onSelectTier={vi.fn()}
        tierDisabled
      />,
    );

    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    familyGroup
      .querySelectorAll('[role="radio"]')
      .forEach((radio) => expect(radio).not.toBeDisabled());

    const tierGroup = screen.getByRole('radiogroup', { name: 'Niveau VDP' });
    tierGroup.querySelectorAll('[role="radio"]').forEach((radio) => expect(radio).toBeDisabled());
  });
});
