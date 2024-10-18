import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { ActionsCell } from './ActionsCell.component';
import { mockedInstance } from '@/__mocks__/instance/constants';

vi.mock('react-router-dom', () => ({
  useHref: () => mockedInstance.id,
}));

describe('Considering the ActionsCell component', () => {
  test('Should render component correctly', () => {
    render(<ActionsCell instance={mockedInstance} isLoading={false} />);
    const actionsMenuElement = screen.getByTestId('actions-menu-button');
    expect(actionsMenuElement).toBeInTheDocument();
  });
});
