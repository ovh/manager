import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TagsListTopbar from './TagsListTopbar.component';
import {
  useTagManagerContext,
  TagManagerContextProvider,
  TagManagerContextType,
} from '@/pages/tagManager/TagManagerContext';
import { TagType } from '@/data/api/get-iam-tags';

const navigateMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...importOriginal(),
  useNavigate: () => navigateMock,
}));

vi.mock('@/pages/tagManager/TagManagerContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useTagManagerContext: vi.fn(),
}));

vi.mock('../tagsListFilter/tagsListFilter.component', () => ({
  default: () => <>tags-list-filter</>,
}));

vi.mock('@/components/assignTagsButton/assignTagsButton', () => ({
  default: ({ isDisabled }: { isDisabled: boolean }) => (
    <>{isDisabled ? 'disabled' : 'enabled'}</>
  ),
}));

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = ({
  isShowSystemChecked,
  isShowUnassignedResourcesChecked,
  selectedTagsList,
  setSelectedTagsList,
  toggleSystemCheck,
  toggleUnassignedResources,
}: Partial<TagManagerContextType>) => {
  vi.mocked(useTagManagerContext).mockReturnValue({
    selectedTagsList: selectedTagsList || [],
    setSelectedTagsList: setSelectedTagsList || vi.fn(),
    isShowSystemChecked: !!isShowSystemChecked,
    isShowUnassignedResourcesChecked: !!isShowUnassignedResourcesChecked,
    toggleSystemCheck: toggleSystemCheck || vi.fn(),
    toggleUnassignedResources: toggleUnassignedResources || vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TagManagerContextProvider>
        <TagsListTopbar />
      </TagManagerContextProvider>
    </QueryClientProvider>,
  );
};

describe('TagListTopBar Component', async () => {
  it.each([
    { tagsList: [], state: 'disabled' },
    {
      tagsList: [
        {
          name: 'test',
          count: 0,
          type: TagType.CUSTOM_TAG,
        },
      ],
      state: 'enabled',
    },
  ])('Should display $state for assign button', async ({ tagsList, state }) => {
    const { getByText } = renderComponent({ selectedTagsList: tagsList });

    waitFor(() => {
      expect(getByText(state)).toBeDefined();
    });
  });
});
