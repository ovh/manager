import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { ActionsCell, TActionsCellProps } from './ActionsCell.component';

vi.mock('react-router-dom', () => ({
  useHref: () => 'foo',
}));

const initialProps: TActionsCellProps = {
  isLoading: false,
  hrefs: {
    deleteHref: 'foo/delete',
    detailsHref: 'foo/details',
    autobackupHref: 'foo/autobackup',
  },
};

describe('Considering the ActionsCell component', () => {
  test('Should render component correctly', () => {
    render(<ActionsCell {...initialProps} />);
    const actionsMenuElement = screen.getByTestId('actions-menu-button');
    expect(actionsMenuElement).toBeInTheDocument();
  });
});
