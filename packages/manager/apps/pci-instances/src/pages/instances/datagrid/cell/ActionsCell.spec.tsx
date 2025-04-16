import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test('Should render grouped actions menu items with correct labels and hrefs', async () => {
    const user = userEvent.setup();

    const instance: TInstance = {
      ...mockedInstance,
      actions: new Map([
        [
          'boot',
          [
            {
              label: 'pci_instances_list_action_start',
              link: { path: '/start', isExternal: false },
            },
          ],
        ],
        [
          'details',
          [
            {
              label: 'pci_instances_list_action_stop',
              link: { path: '/stop', isExternal: false },
            },
          ],
        ],
      ]),
    };

    render(<ActionsCell isLoading={false} instance={instance} />);
    const actionsMenuElement = screen.getByTestId('actions-menu-button');
    await act(async () => {
      await user.click(actionsMenuElement);
    });

    const menuItems = screen.getAllByTestId('actions-menu-item');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveAttribute('href', '/start');
    expect(menuItems[0]).toHaveTextContent('pci_instances_list_action_start');
    expect(menuItems[1]).toHaveTextContent('pci_instances_list_action_stop');
  });
});
