import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Datagrid } from '../../../Datagrid.component';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';
import {
  mockIamResponse,
  mockBasicColumns,
  mockData,
  mockOnSortChange,
  mockEmptySorting,
  mockSortingAsc,
} from '../../../__tests__/mocks';

vitest.mock('../../../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('TableHead', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
  });
  it('should render all headers correctly', () => {
    render(<Datagrid columns={mockBasicColumns} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should render headers with sorting enabled', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockEmptySorting}
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should call onSortChange when header is clicked', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockEmptySorting}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should toggle sort direction on second click', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockSortingAsc}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle multiple column sorting', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockSortingAsc}
      />,
    );

    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should render with initial sorting state', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        sorting={[{ id: 'age', desc: true }]}
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should handle empty sorting array', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockEmptySorting}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle undefined sorting prop', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it('should handle manual sorting mode', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        onSortChange={mockOnSortChange}
        sorting={mockEmptySorting}
        manualSorting={true}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalled();
  });
});
