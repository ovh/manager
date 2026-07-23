import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import {
  LicenseFamily,
  OrderStepId,
  ServerVaultFormState,
  VdpTier,
} from '@/types/Order.type';

import OrderSummary from './OrderSummary.component';

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé.
// On asserte donc sur les clés i18n (convention en place, cf. OnboardingHighlights.spec).

const baseForm: ServerVaultFormState = {
  displayName: 'backup-prod',
  backupServerExternalIp: '185.26.17.45',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

/** L'accordéon est replié par défaut : on clique l'en-tête pour déplier le détail. */
const expand = () => fireEvent.click(screen.getByText('summary.title'));

describe('OrderSummary', () => {
  it('est replié par défaut : seul le titre est visible', async () => {
    await renderWithProviders(
      <OrderSummary
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={baseForm}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText('summary.title')).toBeInTheDocument();
    // Le prix n'est plus dupliqué ici : il vit dans le footer, près du bouton Commander.
    expect(screen.queryByText('summary.price.value')).not.toBeInTheDocument();
    // Le détail (offre) n'est pas monté tant que l'accordéon est fermé.
    expect(
      screen.queryByText('license.enterprise_plus.title'),
    ).not.toBeInTheDocument();
  });

  it('rappelle la licence, le niveau VDP et le stockage inclus une fois déplié', async () => {
    await renderWithProviders(
      <OrderSummary
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        form={baseForm}
        onEdit={vi.fn()}
      />,
    );
    expand();

    expect(screen.getByText('license.data_platform.title')).toBeInTheDocument();
    expect(screen.getByText('summary.field.tier')).toBeInTheDocument();
    expect(screen.getByText('tier.premium.title')).toBeInTheDocument();
    expect(
      screen.getByText('summary.vault_included_value'),
    ).toBeInTheDocument();
  });

  it("n'affiche pas la ligne « Niveau » hors Data Platform", async () => {
    await renderWithProviders(
      <OrderSummary
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={baseForm}
        onEdit={vi.fn()}
      />,
    );
    expand();

    expect(
      screen.getByText('license.enterprise_plus.title'),
    ).toBeInTheDocument();
    expect(screen.queryByText('summary.field.tier')).not.toBeInTheDocument();
  });

  it('rappelle le nom du Vault et la localisation (choix irréversibles), sans répéter le reste de la config', async () => {
    await renderWithProviders(
      <OrderSummary
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        form={baseForm}
        onEdit={vi.fn()}
      />,
    );
    expand();

    // Les deux décisions définitives sont relues avant de commander.
    expect(screen.getByText('summary.field.vault_name')).toBeInTheDocument();
    expect(screen.getByText('vault-prod-paris')).toBeInTheDocument();
    expect(screen.getByText('summary.field.region')).toBeInTheDocument();
    expect(screen.getByText('region.par.name')).toBeInTheDocument();

    // Les champs non irréversibles saisis à l'étape ne sont pas répétés ici.
    expect(
      screen.queryByText('summary.field.service_name'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('summary.field.public_ip'),
    ).not.toBeInTheDocument();
  });

  it("affiche le placeholder « à renseigner » quand la famille n'est pas résolue", async () => {
    await renderWithProviders(
      <OrderSummary family={null} tier={null} form={baseForm} onEdit={vi.fn()} />,
    );
    expand();

    expect(screen.getByText('summary.empty')).toBeInTheDocument();
  });

  it("déclenche onEdit vers l'étape licence au clic sur « Modifier »", async () => {
    const onEdit = vi.fn();
    await renderWithProviders(
      <OrderSummary
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={baseForm}
        onEdit={onEdit}
      />,
    );
    expand();

    fireEvent.click(screen.getByText('summary.edit'));
    expect(onEdit).toHaveBeenCalledWith(OrderStepId.LICENSE_TYPE);
  });
});
