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
          <button key={item.id} type="button" disabled={item.isDisabled}>
            {item.label}
          </button>
        ))}
      </div>
    ),
  };
});

describe('BackupServerActionsCell', () => {
  // Les entrées sont volontairement actives mais sans effet le temps de la revue visuelle
  // (cf. le composant) : à rebasculer sur `toBeDisabled()` quand `isDisabled: true` reviendra.
  it('exposes both row actions, clickable until tickets 2.3/2.4 ship', async () => {
    await renderWithProviders(<BackupServerActionsCell isDisabled={false} />);

    expect(screen.getByRole('button', { name: 'modify' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'delete' })).toBeEnabled();
  });

  it('leaves the menu itself enabled when no operation is in flight', async () => {
    await renderWithProviders(<BackupServerActionsCell isDisabled={false} />);

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'false');
  });

  it('disables the whole menu while an operation is in flight', async () => {
    await renderWithProviders(<BackupServerActionsCell isDisabled />);

    expect(screen.getByTestId('action-menu')).toHaveAttribute('data-disabled', 'true');
  });
});
