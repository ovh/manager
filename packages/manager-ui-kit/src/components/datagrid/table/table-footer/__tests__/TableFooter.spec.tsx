import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '@/setupTest';

import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';
import { TableFooter } from '../TableFooter.component';

vi.mock('../../../../../hooks/iam');

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('TableFooter', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should render the footer with basic props', () => {
    render(<TableFooter hasNextPage={false} isLoading={false} itemsCount={10} totalCount={100} />);

    // Should render footer info
    expect(screen.getByText('10 sur 100 résultats')).toBeInTheDocument();

    // Should not render pagination buttons when hasNextPage is false
    expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    expect(screen.queryByText('Charger tout')).not.toBeInTheDocument();
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

    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    expect(screen.getByText('Charger tout')).toBeInTheDocument();
  });

  it('should render only Charger plus button when onFetchAllPages is not provided', () => {
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

    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    expect(screen.queryByText('Charger tout')).not.toBeInTheDocument();
  });

  it('should render only Charger tout button when onFetchNextPage is not provided', () => {
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

    expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    expect(screen.getByText('Charger tout')).toBeInTheDocument();
  });

  it('should call onFetchNextPage when Charger plus button is clicked', () => {
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

    const loadMoreButton = screen.getByText('Charger plus');
    fireEvent.click(loadMoreButton);

    expect(mockOnFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should call onFetchAllPages when Charger tout button is clicked', () => {
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

    const loadAllButton = screen.getByText('Charger tout');
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

    const loadMoreButton = screen.getByText('Charger plus');
    const loadAllButton = screen.getByText('Charger tout');

    expect(loadMoreButton).toBeDisabled();
    expect(loadAllButton).toBeDisabled();
  });

  it('should render footer info with only itemsCount when totalCount is not provided', () => {
    render(<TableFooter hasNextPage={false} isLoading={false} itemsCount={5} totalCount={5} />);

    expect(screen.getByText('5 sur 5 résultats')).toBeInTheDocument();
  });

  it('should render footer info with itemsCount and totalCount', () => {
    render(<TableFooter hasNextPage={false} isLoading={false} itemsCount={25} totalCount={150} />);

    expect(screen.getByText('25 sur 150 résultats')).toBeInTheDocument();
  });

  it('should render footer info with zero itemsCount', () => {
    render(<TableFooter hasNextPage={false} isLoading={false} itemsCount={0} totalCount={100} />);

    expect(screen.getByText('0 sur 100 résultats')).toBeInTheDocument();
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

    expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    expect(screen.queryByText('Charger tout')).not.toBeInTheDocument();
  });

  it('should render with undefined props', () => {
    render(<TableFooter />);

    // Should not render pagination buttons
    expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    expect(screen.queryByText('Charger tout')).not.toBeInTheDocument();
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

    const loadMoreButton = screen.getByText('Charger plus');
    const loadAllButton = screen.getByText('Charger tout');

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
      <TableFooter hasNextPage={false} isLoading={false} itemsCount={9999} totalCount={99999} />,
    );

    // ODS 19.2.0 may format numbers, so use flexible matcher
    expect(screen.getByText(/9999.*99999.*résultats/i)).toBeInTheDocument();
  });
});
