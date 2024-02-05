import { describe, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import PageButton from '@/components/datagrid/pagination/PageButton';

describe('Datagrid Pagination Page Button', () => {
  it('should display page button', async () => {
    render(<PageButton onClick={() => {}}>10</PageButton>);

    const pageChildren = screen.getByText('10');
    const button = screen.getByTestId('button');

    await waitFor(() => {
      expect(pageChildren).toBeInTheDocument();
      expect(button).toHaveAttribute('variant', 'ghost');
    });
  });

  it('should display current page button', async () => {
    render(
      <PageButton onClick={() => {}} isCurrent>
        1
      </PageButton>,
    );
    const pageChildren = screen.getByText('1');
    const button = screen.getByTestId('button');

    await waitFor(() => {
      expect(pageChildren).toBeInTheDocument();
      expect(button).toHaveAttribute('variant', 'flat');
    });
  });

  it('should trigger onClick when clicked', async () => {
    const handleClick = vi.fn();

    render(<PageButton onClick={handleClick}>1</PageButton>);

    const button = screen.getByTestId('button');
    fireEvent.click(button as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
