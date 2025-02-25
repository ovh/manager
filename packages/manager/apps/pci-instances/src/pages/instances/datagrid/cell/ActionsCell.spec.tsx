import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { ActionsCell, TActionsCellProps } from './ActionsCell.component';
import { mockedInstance } from '@/__mocks__/instance/constants';
import { TInstance } from '@/types/instance/entity.type';

vi.mock('react-router-dom', () => ({
  useHref: () => '/start',
}));

const initialProps: TActionsCellProps = {
  isLoading: false,
  instance: mockedInstance,
};

describe('Considering the ActionsCell component', () => {
  test('Should render component correctly', () => {
    render(<ActionsCell {...initialProps} />);
    const actionsMenuElement = screen.getByTestId('actions-menu-button');
    expect(actionsMenuElement).toBeInTheDocument();
  });

  test('Should render actions menu items with correct labels and hrefs', () => {
    const instance: TInstance = {
      ...mockedInstance,
      actions: [
        {
          name: 'start',
          enabled: true,
          link: { path: '/start', isExternal: false },
        },
        {
          name: 'stop',
          enabled: false,
          link: { path: '/stop', isExternal: false },
        },
      ],
    };

    render(<ActionsCell isLoading={false} instance={instance} />);

    const menuItems = screen.getAllByTestId('actions-menu-item');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveAttribute('href', '/start');
    expect(menuItems[0]).toHaveTextContent('pci_instances_list_action_start');
    expect(menuItems[1]).toHaveTextContent('pci_instances_list_action_stop');
    expect(menuItems[1]).toBeDisabled();
  });
});
