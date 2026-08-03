import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ActionMenuProps } from '@ovh-ux/manager-react-components';

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

    expect(screen.getByRole('button', { name: 'modify' })).toHaveAttribute(
      'data-href',
      '/edit/server-1',
    );
  });

  // « Supprimer » reste inerte (BKP-2.4, hors périmètre de cette branche).
  it('keeps the delete action inert', async () => {
    await renderWithProviders(
      <BackupServerActionsCell backupServerId="server-1" isDisabled={false} />,
    );

    expect(screen.getByRole('button', { name: 'delete' })).not.toHaveAttribute('data-href');
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
