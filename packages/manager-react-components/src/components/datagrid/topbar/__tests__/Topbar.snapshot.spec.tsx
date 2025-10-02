import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../../utils/test.provider';
import { Topbar } from '../Topbar.component';
import {
  mockIamResponse,
  mockColumns,
  mockVisibleColumns,
  mockSearch,
  mockEmptySearch,
  mockFilters,
  mockFiltersWithData,
  mockFiltersWithMultipleData,
  mockColumnVisibility,
  mockSetColumnVisibility,
  mockGetIsAllColumnsVisible,
  mockGetIsSomeColumnsVisible,
  mockToggleAllColumnsVisible,
  mockColumnsWithoutSearch,
  mockColumnsWithoutFilter,
  mockColumnsWithoutVisibility,
  mockVisibleColumnsWithoutHiding,
} from '../../__tests__/mocks';
import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';

// Mock the IAM hook
vi.mock('../../../../hooks/iam', () => ({
  useAuthorizationIam: vi.fn(() => mockIamResponse),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('Topbar Snapshot Tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
  });
  it('should match snapshot with basic props', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom topbar content', () => {
    const customTopbar = <div>Custom topbar content</div>;
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        topbar={customTopbar}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search enabled', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableSearch={true}
        search={mockSearch}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with filters enabled', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableFilter={true}
        filters={mockFilters}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with column visibility enabled', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all features enabled', () => {
    const customTopbar = <div>Custom topbar content</div>;
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        topbar={customTopbar}
        enableSearch={true}
        search={mockSearch}
        enableFilter={true}
        filters={mockFilters}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with partial column visibility', () => {
    const partialVisibleColumns = [
      {
        id: 'name',
        columnDef: { header: 'Name', enableHiding: true },
        getIsVisible: vi.fn(() => true),
        getCanHide: vi.fn(() => true),
        getToggleVisibilityHandler: vi.fn(() => vi.fn()),
      } as any,
      {
        id: 'age',
        columnDef: { header: 'Age', enableHiding: true },
        getIsVisible: vi.fn(() => false),
        getCanHide: vi.fn(() => true),
        getToggleVisibilityHandler: vi.fn(() => vi.fn()),
      } as any,
    ];

    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={partialVisibleColumns}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => false)}
        getIsSomeColumnsVisible={vi.fn(() => true)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with active filters', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableFilter={true}
        filters={mockFiltersWithData}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with resource type', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableFilter={true}
        filters={mockFilters}
        resourceType="users"
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with empty visible columns', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={[]}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with undefined props', () => {
    const { container } = render(<Topbar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with columns that have no search feature', () => {
    const { container } = render(
      <Topbar
        columns={mockColumnsWithoutSearch}
        visibleColumns={mockVisibleColumns}
        enableSearch={true}
        search={mockSearch}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with columns that have no filter feature', () => {
    const { container } = render(
      <Topbar
        columns={mockColumnsWithoutFilter}
        visibleColumns={mockVisibleColumns}
        enableFilter={true}
        filters={mockFilters}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with columns that have no visibility feature', () => {
    const { container } = render(
      <Topbar
        columns={mockColumnsWithoutVisibility}
        visibleColumns={mockVisibleColumnsWithoutHiding}
        enableColumnvisibility={true}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search and custom placeholder', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableSearch={true}
        search={mockEmptySearch}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with multiple active filters', () => {
    const { container } = render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableFilter={true}
        filters={mockFiltersWithMultipleData}
        getIsAllColumnsVisible={mockGetIsAllColumnsVisible}
        getIsSomeColumnsVisible={mockGetIsSomeColumnsVisible}
        toggleAllColumnsVisible={mockToggleAllColumnsVisible}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
