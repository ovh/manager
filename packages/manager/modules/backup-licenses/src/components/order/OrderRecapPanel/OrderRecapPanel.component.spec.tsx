import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';

import OrderRecapPanel from './OrderRecapPanel.component';

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé.
// On asserte donc sur les clés i18n (convention en place, cf. OnboardingHighlights.spec).

const EMPTY_FORM: ServerVaultFormState = {
  displayName: '',
  backupServerExternalIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: '',
  regionApiValue: null,
};

describe('OrderRecapPanel', () => {
  it('n\'affiche pas la ligne "niveau" pour une licence Enterprise Plus', async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.queryByText('summary.field.tier')).not.toBeInTheDocument();
  });

  it('affiche la ligne "niveau" pour une licence Data Platform', async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        form={EMPTY_FORM}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByText('summary.field.tier')).toBeInTheDocument();
  });

  it('affiche le placeholder "à renseigner" pour les valeurs vides', async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getAllByText('summary.empty').length).toBeGreaterThan(0);
  });

  it('affiche la localisation choisie une fois renseignée (pas le placeholder vide)', async () => {
    const form: ServerVaultFormState = { ...EMPTY_FORM, regionApiValue: 'eu-west-par' };
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={form}
        onFinalize={vi.fn()}
      />,
    );

    // Le référentiel `/location` n'est pas chargé ici : on affiche le nom de région brut.
    expect(screen.getByText('eu-west-par')).toBeInTheDocument();
  });

  it('déclenche onFinalize au clic sur le CTA', async () => {
    const onFinalize = vi.fn();
    const { container } = await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        onFinalize={onFinalize}
      />,
    );

    // `label` est un attribut de <ods-button>, pas du texte enfant (cf. OnboardingHighlights.spec).
    const cta = container.querySelector('ods-button[label="summary.cta"]');
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta as Element);
    expect(onFinalize).toHaveBeenCalledOnce();
  });
});
