import { describe, expect, test, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverContent } from '@ovhcloud/ods-react';
import { ActionsMenu } from './ActionsMenu.component';
import { ActionMenuItem, TActionsMenuItem } from './ActionMenuItem.component';

vi.mock('react-router-dom', () => ({
  useHref: () => '/item1',
}));

const prepareTest = (item: TActionsMenuItem) => {
  render(
    <Popover>
      <PopoverContent>
        <ActionMenuItem item={item} />
      </PopoverContent>
    </Popover>,
  );
  return screen.getByTestId('actions-menu-item');
};

describe('Considering the ActionsMenu components', () => {
  test('Should render a menu with grouped items', async () => {
    const user = userEvent.setup();

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
    expect(screen.getByTestId('actions-menu-button')).toBeInTheDocument();
    await act(async () => {
      await user.click(button);
    });
    expect(screen.getAllByTestId('actions-menu-item')).toHaveLength(2);
  });

  test('Should render a menu item with an internal link', () => {
    const item = {
      label: 'Item 1',
      isDisabled: false,
      link: { path: '/item1', isExternal: false },
    };
    const elt = prepareTest(item);
    expect(elt).toBeInTheDocument();
    expect(elt).toHaveAttribute('href', '/item1');
  });

  test('Should render a menu item with an external link', () => {
    const item = {
      label: 'Item 2',
      isDisabled: false,
      link: { path: '/item2', isExternal: true },
    };
    const elt = prepareTest(item);
    expect(elt).toBeInTheDocument();
    expect(elt).toHaveAttribute('href', '/item2');
  });

  test('Should render a menu item with a custom label', () => {
    const item = {
      label: 'Custom Label',
      isDisabled: false,
      link: { path: '/item1', isExternal: false },
    };
    const elt = prepareTest(item);
    expect(elt).toHaveTextContent('Custom Label');
  });
});
