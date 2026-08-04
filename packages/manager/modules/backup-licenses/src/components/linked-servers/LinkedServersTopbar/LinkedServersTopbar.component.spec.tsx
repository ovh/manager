import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import LinkedServersTopbar from './LinkedServersTopbar.component';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

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
      iamActions,
      urn,
      'data-testid': dataTestId,
    }: {
      label: string;
      onClick?: () => void;
      iamActions?: string[];
      urn?: string;
      'data-testid'?: string;
    }) => (
      <button
        type="button"
        data-testid={dataTestId}
        data-urn={urn}
        data-iam-actions={iamActions?.join(',')}
        onClick={onClick}
      >
        {label}
      </button>
    ),
  };
});

describe('LinkedServersTopbar', () => {
  it('navigates to the additional server funnel when clicking the add CTA', async () => {
    await renderWithProviders(<LinkedServersTopbar isLoading={false} onRefresh={vi.fn()} />);

    await userEvent.click(screen.getByTestId('add-backup-server'));

    expect(navigateMock).toHaveBeenCalledWith('/add-server');
  });

  it('refreshes the list when clicking the refresh button', async () => {
    const onRefresh = vi.fn();
    await renderWithProviders(<LinkedServersTopbar isLoading={false} onRefresh={onRefresh} />);

    await userEvent.click(screen.getByTestId('refresh-backup-servers'));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('guards the add CTA with the backupLicenses edit IAM permission and the tenant urn', async () => {
    await renderWithProviders(
      <LinkedServersTopbar
        isLoading={false}
        onRefresh={vi.fn()}
        urn="urn:v1:eu:resource:backupServices:vspc/vspc-1"
      />,
    );

    expect(screen.getByTestId('add-backup-server')).toHaveAttribute(
      'data-urn',
      'urn:v1:eu:resource:backupServices:vspc/vspc-1',
    );
    expect(screen.getByTestId('add-backup-server')).toHaveAttribute(
      'data-iam-actions',
      'backupServices:apiovh:vspc/backupLicenses/edit',
    );
  });
});
