import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AddServerFormState } from '@/hooks/useAddServerForm/useAddServerForm';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import AddServerRecapPanel from './AddServerRecapPanel.component';

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé.

const EMPTY_FORM: AddServerFormState = {
  displayName: '',
  backupServerExternalIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
};

describe('AddServerRecapPanel', () => {
  it('n\'affiche pas la ligne "niveau" pour une licence Enterprise Plus', async () => {
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.queryByText('summary.field.tier')).not.toBeInTheDocument();
  });

  it('affiche la ligne "niveau" pour une licence Data Platform', async () => {
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.DATA_PLATFORM}
        tier={VdpTier.PREMIUM}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByText('summary.field.tier')).toBeInTheDocument();
  });

  it('affiche le nom du serveur saisi', async () => {
    const form: AddServerFormState = { ...EMPTY_FORM, displayName: 'backup-prod' };
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={form}
        isSubmitting={false}
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByText('backup-prod')).toBeInTheDocument();
  });

  it('déclenche onFinalize au clic sur le CTA', async () => {
    const onFinalize = vi.fn();
    const { container } = await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={onFinalize}
      />,
    );

    const cta = container.querySelector('ods-button[label="add_server.summary.cta"]');
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta as Element);
    expect(onFinalize).toHaveBeenCalledOnce();
  });

  it('désactive le CTA pendant la soumission', async () => {
    const { container } = await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting
        onFinalize={vi.fn()}
      />,
    );

    const cta = container.querySelector('ods-button[label="add_server.summary.cta"]');
    expect(cta).toHaveAttribute('is-disabled', 'true');
  });
});
