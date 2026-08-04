import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActionMenuProps } from '@ovh-ux/manager-react-components';

import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BACKUP_LICENSES_IAM_RULES } from '@/module.constants';

import BackupServerActionsCell from './BackupServerActionsCell.component';

const { mockedUseAuthorizationIam } = vi.hoisted(() => ({
  mockedUseAuthorizationIam: vi.fn((_actions?: string[], _urn?: string) => ({
    isAuthorized: true,
    isLoading: false,
  })),
}));

// `ActionMenu` est un web component ODS sous le capot : on le remplace par un rendu DOM
// simple, ce qui permet d'asserter exactement ce que la cellule lui passe. `useAuthorizationIam`
// autorisé par défaut : seuls les tests dédiés au fail-closed le font échouer.
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useAuthorizationIam: mockedUseAuthorizationIam,
    ActionMenu: ({ items, isDisabled }: ActionMenuProps) => (
      <div data-testid="action-menu" data-disabled={String(!!isDisabled)}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.isDisabled}
            onClick={item.onClick}
            data-testid={`action-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    ),
  };
});

const authorizedUrn = 'urn:v1:eu:resource:backupServices:vspc/backupLicenses/server-1';

describe('BackupServerActionsCell', () => {
  beforeEach(() => {
    mockedUseAuthorizationIam.mockReturnValue({ isAuthorized: true, isLoading: false });
  });

  it('navigates to the edit page when the modify action is clicked', async () => {
    await renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={<BackupServerActionsCell backupServerId="server-1" isDisabled={false} urn={authorizedUrn} />}
        />
        <Route path="/edit/:backupServerId" element={<div data-testid="edit-page" />} />
      </Routes>,
      { initialEntries: ['/'] },
    );

    fireEvent.click(screen.getByRole('button', { name: labels.actions.modify }));

    expect(screen.getByTestId('edit-page')).toBeInTheDocument();
  });

  // La modale est une route enfant de la liste : on reproduit cette imbrication, sans quoi le
  // chemin se résoudrait depuis la racine.
  it('navigates to the deletion modal when the delete action is clicked', async () => {
    await renderWithProviders(
      <Routes>
        <Route
          path="/linked-servers"
          element={<BackupServerActionsCell backupServerId="server-1" isDisabled={false} urn={authorizedUrn} />}
        />
        <Route path="/linked-servers/delete/:backupServerId" element={<div data-testid="delete-modal" />} />
      </Routes>,
      { initialEntries: ['/linked-servers'] },
    );

    fireEvent.click(screen.getByRole('button', { name: labels.actions.delete }));

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('leaves the menu itself enabled when no operation is in flight', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} urn={authorizedUrn} />,
    );

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'false');
  });

  it('disables the whole menu while an operation is in flight', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled urn={authorizedUrn} />,
    );

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'true');
  });

  it('disables both actions when no urn is available (fail-closed, not fail-open)', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} />,
    );

    expect(screen.getByRole('button', { name: labels.actions.modify })).toBeDisabled();
    expect(screen.getByRole('button', { name: labels.actions.delete })).toBeDisabled();
  });

  it('disables only the modify action when the user lacks the edit permission', async () => {
    mockedUseAuthorizationIam.mockImplementation((actions: string[] = []) => ({
      isAuthorized: actions[0] !== BACKUP_LICENSES_IAM_RULES['vspc/backupLicenses/edit'],
      isLoading: false,
    }));

    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} urn={authorizedUrn} />,
    );

    expect(screen.getByRole('button', { name: labels.actions.modify })).toBeDisabled();
    expect(screen.getByRole('button', { name: labels.actions.delete })).toBeEnabled();
  });

  it('disables only the delete action when the user lacks the delete permission', async () => {
    mockedUseAuthorizationIam.mockImplementation((actions: string[] = []) => ({
      isAuthorized: actions[0] !== BACKUP_LICENSES_IAM_RULES['vspc/backupLicenses/delete'],
      isLoading: false,
    }));

    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} urn={authorizedUrn} />,
    );

    expect(screen.getByRole('button', { name: labels.actions.modify })).toBeEnabled();
    expect(screen.getByRole('button', { name: labels.actions.delete })).toBeDisabled();
  });
});
