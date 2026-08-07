import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupServicesCatalog } from '@/data/api/catalog/catalog.requests';
import { AddServerFormState } from '@/hooks/useAddServerForm/useAddServerForm';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { OrderCatalog } from '@/types/Catalog.type';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import AddServerRecapPanel from './AddServerRecapPanel.component';

vi.mock('@/data/api/catalog/catalog.requests');

const mockedGetBackupServicesCatalog = vi.mocked(getBackupServicesCatalog);

const catalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 0.2 },
  plans: [{ planCode: 'backup-tenant', pricings: [] }],
  addons: [
    {
      planCode: 'vspc-backuplicenses-enterpriseplus-vm',
      pricings: [
        {
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 999_000_000,
          tax: 199_800_000,
        },
      ],
    },
  ],
};

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

beforeEach(() => {
  mockedGetBackupServicesCatalog.mockResolvedValue(catalog);
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

  it('affiche le prix catalogue du plan choisi', async () => {
    const { container } = await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={vi.fn()}
      />,
    );

    await waitFor(() => expect(container.textContent).toContain('9,99'));
  });

  it('affiche le placeholder "à renseigner" quand le catalogue ne propose pas ce plan', async () => {
    mockedGetBackupServicesCatalog.mockResolvedValue({ ...catalog, addons: [] });

    await renderWithProviders(
      <AddServerRecapPanel
        family={LicenseFamily.ENTERPRISE_PLUS}
        tier={null}
        form={EMPTY_FORM}
        isSubmitting={false}
        onFinalize={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getAllByText('À renseigner').length).toBeGreaterThan(0));
  });
});
