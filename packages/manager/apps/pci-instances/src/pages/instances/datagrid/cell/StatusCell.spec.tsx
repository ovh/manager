import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import { mockedInstance } from '@/__mocks__/instance/constants';
import { StatusCell } from './StatusCell.component';

describe('Considering the StatusCell component', () => {
  test('Should render component correctly', () => {
    render(<StatusCell instance={mockedInstance} isLoading={false} />);
    const statusCellElement = screen.getByTestId('status-chip');
    expect(statusCellElement).toBeInTheDocument();
  });
});
