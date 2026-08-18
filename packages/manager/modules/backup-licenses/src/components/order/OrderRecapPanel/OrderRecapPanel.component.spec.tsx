import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BackupLicensesContext } from '@/BackupLicenses.context';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';

import OrderRecapPanel from './OrderRecapPanel.component';

const EMPTY_FORM: ServerVaultFormState = {
  displayName: '',
  backupServerExternalIp: '',
  veeamClientIp: '',
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
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.queryByText('Niveau')).not.toBeInTheDocument();
  });

  it('affiche la ligne "niveau" pour une licence Data Platform', async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        form={EMPTY_FORM}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByText('Niveau')).toBeInTheDocument();
  });

  it('affiche le placeholder "à renseigner" pour les valeurs vides', async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getAllByText('À renseigner').length).toBeGreaterThan(0);
  });

  it('affiche la localisation choisie une fois renseignée (pas le placeholder vide)', async () => {
    const form: ServerVaultFormState = { ...EMPTY_FORM, regionApiValue: 'eu-west-par' };
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={form}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
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
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={onFinalize}
      />,
    );

    // `label` est un attribut de <ods-button>, pas du texte enfant (cf. OnboardingHighlights.spec).
    const cta = container.querySelector('ods-button[label="Finaliser ma commande"]');
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta as Element);
    expect(onFinalize).toHaveBeenCalledOnce();
  });

  it("n'affiche pas de sur-titre univers quand le scope n'est pas déterminé", async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.queryByText('Hosted Private Cloud')).not.toBeInTheDocument();
    expect(screen.queryByText('Bare Metal Cloud')).not.toBeInTheDocument();
  });

  it('affiche le sur-titre "Hosted Private Cloud" pour le scope Enterprise (HPC)', async () => {
    await renderWithProviders(
      <BackupLicensesContext.Provider
        value={{ appName: 'hpc-backup-licenses', scope: 'Enterprise' }}
      >
        <OrderRecapPanel
          family={LicenseFamily.ENTERPRISE_PLUS}
          tier={null}
          form={EMPTY_FORM}
          isSubmitting={false}
          isSubmitDisabled={false}
          submitError={null}
          onFinalize={vi.fn()}
        />
      </BackupLicensesContext.Provider>,
    );

    expect(screen.getByText('Hosted Private Cloud')).toBeInTheDocument();
  });

  it('grise le CTA et le passe en chargement pendant la soumission', async () => {
    const onFinalize = vi.fn();
    const { container } = await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting
        isSubmitDisabled
        submitError={null}
        onFinalize={onFinalize}
      />,
    );

    const cta = container.querySelector('ods-button[label="Finaliser ma commande"]') as Element;
    expect(cta).toHaveAttribute('is-disabled', 'true');
    expect(cta).toHaveAttribute('is-loading', 'true');
  });

  // La région live existe dès le premier rendu, vide : c'est ce qui rend l'annonce possible ensuite,
  // une région qui naît avec son contenu restant muette.
  it("tient la région live prête, vide, tant qu'aucune commande n'a échoué", async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError={null}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  it("affiche l'échec de commande dans cette région et y amène le focus", async () => {
    await renderWithProviders(
      <OrderRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        isSubmitDisabled={false}
        submitError="La commande a échoué."
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('La commande a échoué.');
    expect(screen.getByRole('alert')).toHaveFocus();
  });

  it('affiche le sur-titre "Bare Metal Cloud" pour le scope Baremetal (BMC)', async () => {
    await renderWithProviders(
      <BackupLicensesContext.Provider
        value={{ appName: 'bmc-backup-licenses', scope: 'Baremetal' }}
      >
        <OrderRecapPanel
          family={LicenseFamily.ENTERPRISE_PLUS}
          tier={null}
          form={EMPTY_FORM}
          isSubmitting={false}
          isSubmitDisabled={false}
          submitError={null}
          onFinalize={vi.fn()}
        />
      </BackupLicensesContext.Provider>,
    );

    expect(screen.getByText('Bare Metal Cloud')).toBeInTheDocument();
  });
});
