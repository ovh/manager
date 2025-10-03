import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../../utils/test.provider';
import { TableFooter } from '../TableFooter.component';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';

vi.mock('../../../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('TableFooter', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should render the footer with basic props', () => {
    render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    // Should render footer info
    expect(screen.getByText('10 of 100 results')).toBeInTheDocument();

    // Should not render pagination buttons when hasNextPage is false
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should render pagination buttons when hasNextPage is true', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeInTheDocument();
  });

  it('should render only load more button when onFetchAllPages is not provided', () => {
    const mockOnFetchNextPage = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should render only load all button when onFetchNextPage is not provided', () => {
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeInTheDocument();
  });

  it('should call onFetchNextPage when load more button is clicked', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);

    expect(mockOnFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should call onFetchAllPages when load all button is clicked', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    const loadAllButton = screen.getByText('Load all');
    fireEvent.click(loadAllButton);

    expect(mockOnFetchAllPages).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isLoading is true', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={true}
        itemsCount={10}
        totalCount={100}
      />,
    );

    const loadMoreButton = screen.getByText('Load more');
    const loadAllButton = screen.getByText('Load all');

    expect(loadMoreButton).toBeDisabled();
    expect(loadAllButton).toBeDisabled();
  });

  it('should render footer info with only itemsCount when totalCount is not provided', () => {
    render(
      <TableFooter hasNextPage={false} isLoading={false} itemsCount={5} />,
    );

    expect(screen.getByText('5 results')).toBeInTheDocument();
  });

  it('should render footer info with itemsCount and totalCount', () => {
    render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={25}
        totalCount={150}
      />,
    );

    expect(screen.getByText('25 of 150 results')).toBeInTheDocument();
  });

  it('should render footer info with zero itemsCount', () => {
    render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={0}
        totalCount={100}
      />,
    );

    expect(screen.getByText('0 of 100 results')).toBeInTheDocument();
  });

  it('should not render pagination buttons when hasNextPage is false', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={false}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should render with undefined props', () => {
    render(<TableFooter />);

    // Should render empty footer info
    expect(screen.getByText('results')).toBeInTheDocument();

    // Should not render pagination buttons
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should handle multiple clicks on pagination buttons', () => {
    const mockOnFetchNextPage = vi.fn();
    const mockOnFetchAllPages = vi.fn();

    render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );

    const loadMoreButton = screen.getByText('Load more');
    const loadAllButton = screen.getByText('Load all');

    // Click multiple times
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadAllButton);
    fireEvent.click(loadAllButton);

    expect(mockOnFetchNextPage).toHaveBeenCalledTimes(2);
    expect(mockOnFetchAllPages).toHaveBeenCalledTimes(2);
  });

  it('should render with large numbers', () => {
    render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={9999}
        totalCount={99999}
      />,
    );

    expect(screen.getByText('9999 of 99999 results')).toBeInTheDocument();
  });
});
