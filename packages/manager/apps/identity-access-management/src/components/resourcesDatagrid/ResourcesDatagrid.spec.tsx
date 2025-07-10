import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from './ResourcesDatagridContext';
import ResourcesListDatagrid, {
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
  isSelectable,
  selectedResourcesList,
  setSelectedResourcesList,
}: ResourcesListDatagridProps & Partial<ResourcesDatagridContextType>) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: selectedResourcesList || [],
    setSelectedResourcesList: setSelectedResourcesList || vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResourcesDatagridContextProvider>
        <ResourcesListDatagrid topbar={topbar} isSelectable={isSelectable} />
      </ResourcesDatagridContextProvider>
    </QueryClientProvider>,
  );
};

describe('resourcesDatagrid Component', async () => {
  it('Should display empty list', async () => {
    const { getByText } = renderComponent({});

    expect(getByText('noResourceAvailableForTagging')).toBeInTheDocument();
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
    expect(getAllByText('dedicatedServer').length).toBe(3);
  });

  it('Should use custom topbar', async () => {
    vi.mocked(useResourcesDatagridContext).mockReturnValue({
      selectedResourcesList: [],
      setSelectedResourcesList: vi.fn(),
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
});
