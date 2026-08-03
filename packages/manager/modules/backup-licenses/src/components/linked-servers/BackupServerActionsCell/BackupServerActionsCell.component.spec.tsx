import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ActionMenuProps } from '@ovh-ux/manager-react-components';

import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import BackupServerActionsCell from './BackupServerActionsCell.component';

// `ActionMenu` est un web component ODS sous le capot : on le remplace par un rendu DOM
// simple, ce qui permet d'asserter exactement ce que la cellule lui passe.
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    ActionMenu: ({ items, isDisabled }: ActionMenuProps) => (
      <div data-testid="action-menu" data-disabled={String(!!isDisabled)}>
        {items.map((item) => (
          <button key={item.id} type="button" disabled={item.isDisabled} data-href={item.href}>
            {item.label}
          </button>
        ))}
      </div>
    ),
  };
});

describe('BackupServerActionsCell', () => {
  it('links the modify action to the edit page of the row', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} />,
    );

    expect(screen.getByRole('button', { name: labels.actions.modify })).toHaveAttribute(
      'data-href',
      '/edit/server-1',
    );
  });

  // Le lien est relatif à la route qui rend le tableau : on reproduit cette imbrication,
  // sans quoi il se résoudrait depuis la racine.
  it('links the delete action to the deletion modal of the row', async () => {
    await renderWithProviders(
      <Routes>
        <Route
          path="/linked-servers"
          element={<BackupServerActionsCell backupServerId="server-1" isDisabled={false} />}
        />
      </Routes>,
      { initialEntries: ['/linked-servers'] },
    );

    expect(screen.getByRole('button', { name: labels.actions.delete })).toHaveAttribute(
      'data-href',
      '/linked-servers/delete/server-1',
    );
  });

  it('leaves the menu itself enabled when no operation is in flight', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} />,
    );

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'false');
  });

  it('disables the whole menu while an operation is in flight', async () => {
    await renderWithProviders(<BackupServerActionsCell backupServerId="server-1" isDisabled />);

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'true');
  });
});
