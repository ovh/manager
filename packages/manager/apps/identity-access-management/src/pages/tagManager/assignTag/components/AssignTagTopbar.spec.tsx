import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import exp from 'constants';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';
import AssignTagTopbar, {
  AssignTagTopbarProps,
} from './AssignTagTopbar.component';
import { iamResourcesListMock } from '@/mocks/iam-resource/iam-resource.mock';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from '@/components/resourcesDatagrid/ResourcesDatagridContext';

const useUpdateIamResourcesMock = vi.hoisted(() => vi.fn());
vi.mock('@/data/hooks/useIamResources', () => ({
  useUpdateIamResources: useUpdateIamResourcesMock,
}));

vi.mock(
  '@/components/resourcesDatagrid/ResourcesDatagridContext',
  async (importOriginal) => ({
    ...(await importOriginal()),
    useResourcesDatagridContext: vi.fn(),
  }),
);

const navigateMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...importOriginal(),
  useNavigate: () => navigateMock,
}));

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = (
  props: AssignTagTopbarProps & Partial<ResourcesDatagridContextType>,
) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: props.selectedResourcesList || [],
    setSelectedResourcesList: props.setSelectedResourcesList || vi.fn(),
    filters: [],
    setFilters: vi.fn(),
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResourcesDatagridContextProvider>
        <AssignTagTopbar {...props} />
      </ResourcesDatagridContextProvider>
    </QueryClientProvider>,
  );
};

describe('AssignTagTopbar Component', async () => {
  it.each([
    { selectedResourcesList: [], state: 'disabled' },
    {
      selectedResourcesList: iamResourcesListMock,
      state: 'enabled',
    },
  ])(
    'Should call onclick callback with formatted tag object with selected resources length : $selectedResourcesList.length',
    async ({ selectedResourcesList, state }) => {
      const updateResourceMock = vi.fn();
      useUpdateIamResourcesMock.mockImplementation(() => ({
        mutate: updateResourceMock,
        isSuccess: false,
      }));

      const { container } = renderComponent({
        tags: ['tag1:1', 'tag2:2', 'tag3:3'],
        selectedResourcesList,
      });

      const button = await getButtonByLabel({
        container,
        label: 'assignToResources',
        disabled: state === 'disabled',
      });

      fireEvent.click(button);

      expect(updateResourceMock).toHaveBeenCalledWith({
        resources: selectedResourcesList,
        tags: {
          tag1: '1',
          tag2: '2',
          tag3: '3',
        },
      });
    },
  );

  it('Should redirect to given url', () => {
    useUpdateIamResourcesMock.mockImplementation(() => ({
      mutate: vi.fn(),
      isSuccess: true,
    }));

    renderComponent({
      tags: ['tag1:1', 'tag2:2', 'tag3:3'],
      selectedResourcesList: iamResourcesListMock,
      onSuccessUrl: 'test',
    });

    waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('test');
    });
  });
});
