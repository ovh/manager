import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const navigateMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...importOriginal(),
  useNavigate: () => navigateMock,
}));

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

      await getButtonByLabel({
        container,
        label: 'unassignTag',
        disabled: unassignTag === 'disabled',
      });

      if (assignTag === 'enabled') {
        fireEvent.click(assignTagButton);
        waitFor(() => {
          expect(navigateMock).toHaveBeenCalledWith(
            urls.tagDetailAssign.replace(':tag', 'env:prod'),
          );
        });
      }

      // TODO to finish while unassign action is done
    },
  );
});
