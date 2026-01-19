import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatatableSearchBar } from './DatatableSearchBar.component';

const setGlobalFilterMock = vi.fn();
const contextMock = {
  table: { setGlobalFilter: setGlobalFilterMock },
  globalFilter: 'test',
};

vi.mock('./DataTable.context', () => ({
  useDataTableContext: () => contextMock,
}));

describe('DatatableSearchBar', () => {
  it('renders input and button if no children', () => {
    render(<DatatableSearchBar />);
    expect(
      screen.getByPlaceholderText('searchPlaceholder'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls setGlobalFilter on input change', () => {
    render(<DatatableSearchBar />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(setGlobalFilterMock).toHaveBeenCalledWith('new value');
  });

  it('calls setGlobalFilter on button click', () => {
    render(<DatatableSearchBar />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setGlobalFilterMock).toHaveBeenCalledWith('test');
  });

  it('renders children if provided', () => {
    render(
      <DatatableSearchBar>
        <div data-testid="custom-child">Custom</div>
      </DatatableSearchBar>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });
});
