import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../utils/test.provider';
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
} from './mocks';

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
        onSortChange={mockOnSortChange}
        sorting={[{ id: 'name', desc: false }]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search enabled', () => {
    const { container } = render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        enableSearch={true}
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
        enableFilter={true}
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
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
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
          enableExpandable: true,
          expanded: {},
          setExpanded: vi.fn(),
        }}
        renderSubComponent={mockRenderSubComponent}
      />,
    );
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
        onSortChange={mockOnSortChange}
        sorting={[{ id: 'name', desc: false }]}
        enableSearch={true}
        search={mockSearch}
        enableFilter={true}
        filters={mockFilters}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        rowSelection={mockRowSelection}
        expandable={{
          enableExpandable: true,
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
