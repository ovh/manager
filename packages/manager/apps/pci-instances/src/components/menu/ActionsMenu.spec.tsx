import { describe, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionsMenu } from './ActionsMenu.component';

vi.mock('react-router-dom', () => ({
  useHref: () => '/item1',
}));

describe('Considering the ActionsMenu components', () => {
  it('should render a menu with grouped items', async () => {
    const items = new Map([
      [
        'details',
        [
          {
            label: 'Item 1',
            isDisabled: false,
            link: { path: '/item1', isExternal: false },
          },
          {
            label: 'Item 2',
            isDisabled: true,
            link: { path: '/item2', isExternal: false },
          },
        ],
      ],
    ]);

    render(<ActionsMenu items={items} />);

    const button = screen.getByTestId('actions-menu-button');
    expect(screen.getByTestId('actions-menu-button')).toBeVisible();
    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getAllByTestId('actions-menu-item')).toHaveLength(2);
  });
});
