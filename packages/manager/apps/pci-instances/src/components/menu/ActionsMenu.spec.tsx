import { describe, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  ActionsMenu,
  groupActionMenuItems,
  TActionsMenuItem,
} from './ActionsMenu.component';

const onMenuItemClickMock = vi.fn();

const testItems: TActionsMenuItem[] = [
  {
    label: 'foo',
    href: '/foo/bar',
  },
  {
    label: 'bar',
    onMenuItemClick: onMenuItemClickMock,
  },
];

const renderActionsMenu = (items: TActionsMenuItem[]) => {
  render(<ActionsMenu items={items} />);
};

describe('Considering the groupActionMenuItems() function', () => {
  test("should group items by 'group' property", () => {
    const items: TActionsMenuItem[] = [
      { group: 'boot', label: 'Start' },
      { group: 'boot', label: 'Stop' },
      { group: 'delete', label: 'Delete' },
      { label: 'Foo' },
    ];

    const result = groupActionMenuItems(items);

    expect(result).toEqual({
      boot: [{ label: 'Start' }, { label: 'Stop' }],
      delete: [{ label: 'Delete' }],
      others: [{ label: 'Foo' }],
    });
  });
});

describe('Considering the ActionsMenu component', () => {
  test('Should render only action menu button with Icon as first child if items prop is []', () => {
    renderActionsMenu([]);
    const actionsMenuButtonElement = screen.getByTestId('actions-menu-button');
    expect(actionsMenuButtonElement).toBeInTheDocument();
    const childElements = actionsMenuButtonElement.querySelectorAll('*');
    expect(childElements.length).toBe(1);
  });

  test('Should render the list of items correctly if provided', () => {
    renderActionsMenu(testItems);
    const menuItemElements = screen.getAllByTestId('actions-menu-item');
    expect(menuItemElements.length).toBe(2);
    const [firstChild, secondChild] = menuItemElements;
    expect(firstChild).toHaveTextContent('foo');
    expect(firstChild).toHaveAttribute('href', '/foo/bar');
    expect(secondChild).toHaveTextContent('bar');
    fireEvent.click(secondChild);
    expect(onMenuItemClickMock).toHaveBeenCalled();
  });
});
