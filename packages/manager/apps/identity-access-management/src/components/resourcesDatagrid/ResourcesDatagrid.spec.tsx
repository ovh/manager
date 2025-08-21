import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from './ResourcesDatagridContext';
import ResourcesListDatagrid, {
  ResourceDatagridColumn,
  ResourcesListDatagridProps,
} from './ResourcesDatagrid.component';
import { iamResourcesListMock } from '@/mocks/iam-resource/iam-resource.mock';
import { getOdsCheckbox } from '@/test-utils/uiTestHelpers';

/** MOCKS */
const queryClient = new QueryClient();

const useIamResourceListMock = vi.hoisted(() =>
  vi.fn(() => ({
    flattenData: [],
    isLoading: false,
    error: undefined,
    isError: undefined,
  })),
);

vi.mock(
  '@/components/resourcesDatagrid/ResourcesDatagridContext',
  async (importOriginal) => ({
    ...(await importOriginal()),
    useResourcesDatagridContext: vi.fn(),
  }),
);

const useIamResourceTypeListMock = vi.hoisted(() =>
  vi.fn(() => ({
    data: ['dedicatedServer'],
  })),
);

vi.mock('@/data/hooks/useIamResources', () => ({
  useIamResourceList: useIamResourceListMock,
  useIamResourceTypeList: useIamResourceTypeListMock,
}));

/** RENDER */
const renderComponent = ({
  topbar,
  hideColumn,
  isSelectable,
  selectedResourcesList,
  setSelectedResourcesList,
  initFilters,
}: ResourcesListDatagridProps & Partial<ResourcesDatagridContextType>) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: selectedResourcesList || [],
    setSelectedResourcesList: setSelectedResourcesList || vi.fn(),
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    setFilters: vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResourcesDatagridContextProvider>
        <ResourcesListDatagrid
          topbar={topbar}
          isSelectable={isSelectable}
          hideColumn={hideColumn}
          initFilters={initFilters}
        />
      </ResourcesDatagridContextProvider>
    </QueryClientProvider>,
  );
};

describe('resourcesDatagrid Component', async () => {
  beforeAll(() => {
    /* eslint-disable class-methods-use-this */
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }

      unobserve() {
        // do nothing
      }

      disconnect() {
        // do nothing
      }
    };
    /* eslint-enable class-methods-use-this */
  });

  it('Should display empty list', async () => {
    const { getByText } = renderComponent({});

    expect(
      getByText('tag-manager:noResourceAvailableForTagging'),
    ).toBeInTheDocument();
  });

  it('Should display resources list', async () => {
    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    const { getByText, getAllByText } = renderComponent({});

    expect(getByText('r1')).toBeInTheDocument();
    expect(
      getAllByText('resource-type:iam_resource_type_dedicatedServer').length,
    ).toBe(3);
  });

  it('Should use custom topbar', async () => {
    vi.mocked(useResourcesDatagridContext).mockReturnValue({
      selectedResourcesList: [],
      setSelectedResourcesList: vi.fn(),
      filters: [],
      addFilter: vi.fn(),
      removeFilter: vi.fn(),
      setFilters: vi.fn(),
    });

    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });

    const { getByText } = renderComponent({ topbar: 'custom-topbar' });

    expect(getByText('custom-topbar')).toBeDefined();
  });

  it('Should display row selection', async () => {
    const setSelectedResourcesListMock = vi.fn();

    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });

    const { container } = renderComponent({
      isSelectable: true,
      setSelectedResourcesList: setSelectedResourcesListMock,
    });

    const bulkCheckbox = await getOdsCheckbox({ container });

    fireEvent.click(bulkCheckbox);

    expect(setSelectedResourcesListMock).toHaveBeenCalled();
  });

  it('Should not display tags column', async () => {
    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });

    const { queryAllByText } = renderComponent({
      isSelectable: true,
      hideColumn: [ResourceDatagridColumn.TAGS],
    });

    expect((await queryAllByText('displayName')).length).toBe(0);
  });

  it('Should display actions column', async () => {
    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });

    const { queryAllByText } = renderComponent({
      isSelectable: true,
      rowActions: (item) => <>{item.name}</>,
    });

    expect((await queryAllByText('r1')).length).toBe(1);
  });

  it('Should filter datagrid with tags by default', async () => {
    useIamResourceListMock.mockReturnValue({
      flattenData: iamResourcesListMock,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });

    renderComponent({
      isSelectable: true,
      initFilters: [
        {
          id: 'test',
          column: 'tags',
          tagKey: 'env',
          value: 'prod',
        },
      ],
    });

    waitFor(() => {
      expect(useIamResourceListMock).toHaveBeenCalledWith({
        pageSize: 20,
        filters: [
          {
            id: 'test',
            column: 'tags',
            tagKey: 'env',
            value: 'prod',
          },
        ],
      });
    });
  });
});
