import { render, screen } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import { NameIdCell } from './NameIdCell.component';
import { mockedInstance } from '@/__mocks__/instance/constants';

vi.mock('react-router-dom', () => ({
  useHref: () => mockedInstance.id,
}));

describe('Considering the NameIdCell component', () => {
  test('Should render component with correct href and labels', () => {
    render(<NameIdCell instance={mockedInstance} isLoading={false} />);
    const nameElement = screen.getByText(mockedInstance.name);
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveAttribute('href', mockedInstance.id);
    const idElement = screen.getByText(mockedInstance.id);
    expect(idElement).toBeInTheDocument();
  });
});
