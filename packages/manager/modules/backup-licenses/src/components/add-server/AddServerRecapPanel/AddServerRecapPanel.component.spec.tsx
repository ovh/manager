import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AddServerFormState } from '@/hooks/useAddServerForm/useAddServerForm';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import AddServerRecapPanel from './AddServerRecapPanel.component';

// `ManagerButton` s'appuie sur `useAuthorizationIam` (appel réseau réel) : on le remplace par un
// rendu DOM simple, ce qui permet d'asserter exactement ce que le composant lui passe (convention
// du module, cf. BackupServerActionsCell.component.spec.tsx).
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    ManagerButton: ({
      label,
      onClick,
      isDisabled,
      iamActions,
      urn,
      'data-testid': dataTestId,
    }: {
      label: string;
      onClick?: () => void;
      isDisabled?: boolean;
      iamActions?: string[];
      urn?: string;
      'data-testid'?: string;
    }) => (
      <button
        type="button"
        data-testid={dataTestId}
        data-urn={urn}
        data-iam-actions={iamActions?.join(',')}
        disabled={isDisabled}
        onClick={onClick}
      >
        {label}
      </button>
    ),
  };
});

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

    expect(screen.queryByText('Niveau')).not.toBeInTheDocument();
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

    expect(screen.getByText('Niveau')).toBeInTheDocument();
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
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={onFinalize}
      />,
    );

    const cta = screen.getByTestId('add-server-submit');
    fireEvent.click(cta);
    expect(onFinalize).toHaveBeenCalledOnce();
  });

  it('désactive le CTA pendant la soumission', async () => {
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting
        onFinalize={vi.fn()}
      />,
    );

    expect(screen.getByTestId('add-server-submit')).toBeDisabled();
  });

  it('guards the CTA with the backupLicenses edit IAM permission and the tenant urn', async () => {
    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={vi.fn()}
        urn="urn:v1:eu:resource:backupServices:vspc/vspc-1"
      />,
    );

    expect(screen.getByTestId('add-server-submit')).toHaveAttribute(
      'data-urn',
      'urn:v1:eu:resource:backupServices:vspc/vspc-1',
    );
    expect(screen.getByTestId('add-server-submit')).toHaveAttribute(
      'data-iam-actions',
      'backupServices:apiovh:vspc/backupLicenses/edit',
    );
  });
});
