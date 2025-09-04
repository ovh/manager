import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ReactRouterDom from 'react-router-dom';
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
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(
      () => mockNavigate,
    );
  });

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
});
