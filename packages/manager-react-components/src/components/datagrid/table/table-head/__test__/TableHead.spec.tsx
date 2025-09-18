import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Datagrid } from '../../../Datagrid.component';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';

vitest.mock('../../../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
  },
];

const data = [
  {
    name: 'John',
    age: 25,
  },
  {
    name: 'Jane',
    age: 26,
  },
];

describe('TableHead', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });
  it('should render all headers correctly', () => {
    render(<Datagrid columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should render headers with sorting enabled', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[]}
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should call onSortChange when header is clicked', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[]}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should toggle sort direction on second click', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[{ id: 'name', desc: false }]}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle multiple column sorting', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[{ id: 'name', desc: false }]}
      />,
    );

    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should render with initial sorting state', () => {
    render(
      <Datagrid
        columns={columns}
        data={data}
        sorting={[{ id: 'age', desc: true }]}
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should handle empty sorting array', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[]}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle undefined sorting prop', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle manual sorting mode', () => {
    const mockOnSortChange = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        onSortChange={mockOnSortChange}
        sorting={[]}
        manualSorting={true}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });
});
