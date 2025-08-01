import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
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

const updateResourceMock = vi.hoisted(() => vi.fn());
vi.mock('@/data/hooks/useIamResources', () => ({
  useUpdateIamResources: () => ({
    mutate: updateResourceMock,
  }),
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
  props: TagDetailTopbarProps & Partial<ResourcesDatagridContextType>,
) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: props.selectedResourcesList || [],
    setSelectedResourcesList: props.setSelectedResourcesList || vi.fn(),
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
      });

      await getButtonByLabel({
        container,
        label: 'assignTag',
        disabled: assignTag === 'disabled',
      });

      await getButtonByLabel({
        container,
        label: 'unassignTag',
        disabled: unassignTag === 'disabled',
      });

      // TODO to finish while assign / unassign action is done
    },
  );
});
