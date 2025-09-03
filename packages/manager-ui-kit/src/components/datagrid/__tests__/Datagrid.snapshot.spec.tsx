import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { render } from '@/setupTest';
import { Datagrid } from '../Datagrid.component';
import { useAuthorizationIam } from '../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import {
  mockIamResponse,
  mockBasicColumns,
  mockData,
  mockOnSortChange,
  mockSearch,
  mockFilters,
  mockColumnVisibility,
  mockSetColumnVisibility,
  mockRenderSubComponent,
  mockRowSelection,
  mockOnFetchNextPage,
  mockOnFetchAllPages,
} from '../__mocks__';

vi.mock('../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('Datagrid Snapshot Tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
  });

  it('should match snapshot with basic props', () => {
    const { container } = render(
      <Datagrid columns={mockBasicColumns} data={mockData} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with sorting enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        sorting={{
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: false,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        search={mockSearch}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with filters enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        filters={mockFilters}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with column visibility enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        columnVisibility={{
          columnVisibility: mockColumnVisibility,
          setColumnVisibility: mockSetColumnVisibility,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with pagination', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        totalCount={100}
        isLoading={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with loading state', () => {
    const { container } = render(
      <Datagrid columns={mockBasicColumns} data={mockData} isLoading={true} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with empty data', () => {
    const { container } = render(
      <Datagrid columns={mockBasicColumns} data={[]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with expandable rows', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        expandable={{
          expanded: { 0: true, 1: true },
          setExpanded: vi.fn(),
        }}
        subComponentHeight={80}
      />,
    );
    const expandableButton = screen.getAllByTestId('manager-button');
    expect(expandableButton[0]).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with row selection', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        rowSelection={mockRowSelection}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom container height', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        containerHeight={400}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all features enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        sorting={{
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: true,
        }}
        search={mockSearch}
        filters={mockFilters}
        columnVisibility={{
          columnVisibility: mockColumnVisibility,
          setColumnVisibility: mockSetColumnVisibility,
        }}
        rowSelection={mockRowSelection}
        expandable={{
          expanded: {},
          setExpanded: vi.fn(),
        }}
        renderSubComponent={mockRenderSubComponent}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        totalCount={100}
        containerHeight={500}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
