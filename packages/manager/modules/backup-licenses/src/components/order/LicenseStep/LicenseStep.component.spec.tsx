import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import LicenseStep from './LicenseStep.component';

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé.
// On asserte donc sur les clés i18n (convention en place, cf. OnboardingHighlights.spec).

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

    expect(
      screen.queryByRole('radiogroup', { name: 'step.vdp_tier.label' }),
    ).not.toBeInTheDocument();
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

    const tierGroup = screen.getByRole('radiogroup', { name: 'step.vdp_tier.label' });
    expect(tierGroup.querySelectorAll('[role="radio"]')).toHaveLength(3);
  });

  it("ne dévoile aucune carte de niveau tant qu'aucune famille n'est sélectionnée", async () => {
    await renderWithProviders(
      <LicenseStep family={null} tier={null} onSelectFamily={vi.fn()} onSelectTier={vi.fn()} />,
    );

    expect(
      screen.queryByRole('radiogroup', { name: 'step.vdp_tier.label' }),
    ).not.toBeInTheDocument();
  });
});
