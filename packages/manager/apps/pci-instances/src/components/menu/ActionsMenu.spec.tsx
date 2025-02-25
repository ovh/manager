import { describe, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ActionsMenu,
  ActionsMenuLink,
  TActionsMenuItem,
} from './ActionsMenu.component';

vi.mock('react-router-dom', () => ({
  useHref: () => '/item1',
}));

const prepareTest = (item: TActionsMenuItem) => {
  render(<ActionsMenuLink item={item} />);
  return screen.getByTestId('actions-menu-item');
};

describe('Considering the ActionsMenu components', () => {
  test('Should render a menu with items', () => {
    const items = [
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
    ];
    render(<ActionsMenu items={items} />);
    expect(screen.getByTestId('actions-menu-button')).toBeInTheDocument();
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

  test('SHould render a disabled menu item', () => {
    const item = {
      label: 'Item 1',
      isDisabled: true,
      link: { path: '/item1', isExternal: false },
    };
    const elt = prepareTest(item);
    expect(elt).toBeDisabled();
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
