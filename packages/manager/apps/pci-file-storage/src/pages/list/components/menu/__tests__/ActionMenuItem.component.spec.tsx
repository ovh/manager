import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ActionMenuItem } from '../ActionMenuItem.component';
import type { TShareAction } from '../action.type';

describe('ActionMenuItem', () => {
  it('should render translated label and internal link', () => {
    const action: TShareAction = {
      labelTranslationKey: 'list:actions.manage',
      link: { path: './share-1' },
    };

    render(
      <MemoryRouter>
        <ActionMenuItem {...action} />
      </MemoryRouter>,
    );

    const item = screen.getByRole('link', { name: 'list:actions.manage' });
    expect(item).toBeVisible();
    expect(item).toHaveTextContent('list:actions.manage');
    expect(item).toHaveAttribute('href', expect.stringContaining('share-1'));
  });

  it('should use external path when link is external', () => {
    const action: TShareAction = {
      labelTranslationKey: 'list:actions.delete',
      link: { path: 'https://example.com/delete', isExternal: true },
    };

    render(
      <MemoryRouter>
        <ActionMenuItem {...action} />
      </MemoryRouter>,
    );

    const item = screen.getByRole('link', { name: 'list:actions.delete' });
    expect(item).toHaveAttribute('href', 'https://example.com/delete');
  });

  it('should set target _blank when isTargetBlank is true', () => {
    const action: TShareAction = {
      labelTranslationKey: 'list:actions.manage',
      link: { path: './share-1', isTargetBlank: true },
    };

    render(
      <MemoryRouter>
        <ActionMenuItem {...action} />
      </MemoryRouter>,
    );

    const item = screen.getByRole('link', { name: 'list:actions.manage' });
    expect(item).toHaveAttribute('target', '_blank');
  });
});
