import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ReactRouterDom from 'react-router-dom';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';
import { iamResourcesListMock } from '@/mocks/iam-resource/iam-resource.mock';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import TagDetailTopbar, {
  TagDetailTopbarProps,
} from './TagDetailTopbar.component';
import { urls } from '@/routes/routes.constant';

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
  props: TagDetailTopbarProps & Partial<ResourcesDatagridContextType>,
) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: props.selectedResourcesList || [],
    setSelectedResourcesList: props.setSelectedResourcesList || vi.fn(),
    addFilter: vi.fn(),
    filters: [],
    setFilters: vi.fn(),
    removeFilter: vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResourcesDatagridContextProvider>
        <TagDetailTopbar {...props} />
      </ResourcesDatagridContextProvider>
    </QueryClientProvider>,
  );
};

describe('TagDetailTopbar Component', async () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(
      () => mockNavigate,
    );
  });

  it.each([
    {
      selectedResourcesList: [],
      assignTag: 'enabled',
      unassignTag: 'disabled',
    },
    {
      selectedResourcesList: iamResourcesListMock,
      assignTag: 'disabled',
      unassignTag: 'enabled',
    },
  ])(
    'Should $assignTag assign Tag and $unassignTag unassign tag buttons when selected resources length is $selectedResourcesList.length',
    async ({ selectedResourcesList, assignTag, unassignTag }) => {
      const { container } = renderComponent({
        selectedResourcesList,
        tag: 'env:prod',
      });

      const assignTagButton = await getButtonByLabel({
        container,
        label: 'assignTag',
        disabled: assignTag === 'disabled',
      });

      const unassignTagButton = await getButtonByLabel({
        container,
        label: 'unassignTag',
        disabled: unassignTag === 'disabled',
      });

      if (assignTag === 'enabled') {
        fireEvent.click(assignTagButton);
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            urls.tagDetailAssign.replace(':tag', 'env:prod'),
          );
        });
      }

      if (unassignTag === 'enabled') {
        fireEvent.click(unassignTagButton);
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            urls.tagdetailUnassign.replace(':tag', 'env:prod'),
            {
              state: {
                resources: iamResourcesListMock,
              },
            },
          );
        });
      }
    },
  );
});
