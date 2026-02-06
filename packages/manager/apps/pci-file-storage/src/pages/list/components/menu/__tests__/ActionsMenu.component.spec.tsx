import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ActionsMenu } from '../ActionsMenu.component';
import type { TShareAction } from '../action.type';

describe('ActionsMenu', () => {
  it('should render menu button enabled when items have actions', () => {
    const items = new Map<string, TShareAction[]>([
      ['actions', [{ label: 'list:actions.manage', link: { path: './share-1' } }]],
    ]);

    render(
      <MemoryRouter>
        <ActionsMenu items={items} />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole('button', { name: 'actions' });
    expect(trigger).toBeVisible();
    expect(trigger).not.toBeDisabled();
  });

  it('should render menu button disabled when items are empty', () => {
    const items = new Map<string, TShareAction[]>();

    render(
      <MemoryRouter>
        <ActionsMenu items={items} />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole('button', { name: 'actions' });
    expect(trigger).toBeDisabled();
  });

  it('should render manage and delete actions in popover when opened', async () => {
    const user = userEvent.setup();
    const items = new Map<string, TShareAction[]>([
      [
        'actions',
        [
          { label: 'list:actions.manage', link: { path: './share-1' } },
          { label: 'list:actions.delete', link: { path: './share-1/delete' } },
        ],
      ],
    ]);

    render(
      <MemoryRouter>
        <ActionsMenu items={items} />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole('button', { name: 'actions' });
    await act(async () => {
      await user.click(trigger);
    });

    expect(screen.getByRole('link', { name: 'list:actions.manage' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'list:actions.delete' })).toBeVisible();
  });
});
