import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import TagsListDatagrid from './TagsListDatagrid.component';
import {
  TagManagerContextProvider,
  TagManagerContextType,
  useTagManagerContext,
} from '../../TagManagerContext';
import tagsList from '../../../../mocks/iam-tags/getIamTags.json';
import { getButtonByLabel, getOdsCheckbox } from '@/test-utils/uiTestHelpers';

/** MOCKS */
const queryClient = new QueryClient();

const useGetIamTagsMock = vi.hoisted(() =>
  vi.fn(() => ({
    tags: tagsList,
    isLoading: true,
    error: undefined,
    isError: undefined,
  })),
);

const addError = vi.fn();
const useNotificationsMock = vi.hoisted(() =>
  vi.fn(() => ({
    addError,
  })),
);

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => ({
  ...(await importOriginal()),
  useNotifications: useNotificationsMock,
}));

vi.mock('../../TagManagerContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useTagManagerContext: vi.fn(),
}));

vi.mock('@/data/hooks/useGetIamTags', () => ({
  useGetIamTags: useGetIamTagsMock,
}));

vi.mock('./tagTypeCell/tagTypeCell.component', () => ({
  default: (item: IamTagListItem) => <div>{item.type}</div>,
}));

vi.mock('./tagsListActions/tagsListActions.component', () => ({
  default: () => <div>actions</div>,
}));

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
        <TagsListDatagrid />
      </TagManagerContextProvider>
    </QueryClientProvider>,
  );
};

describe('TagsListDatagrid Component', async () => {
  it('Should display empty list', async () => {
    useGetIamTagsMock.mockReturnValue({
      tags: { list: [], groupByKeys: [] },
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    const { getByText } = renderComponent({});

    expect(getByText('common_pagination_no_results')).toBeInTheDocument();
  });

  it('Should display tags list', async () => {
    useGetIamTagsMock.mockReturnValue({
      tags: tagsList,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    const { getAllByText, container } = renderComponent({});

    getButtonByLabel({
      container,
      label: 'Environment:Production',
      disabled: true,
    });

    // expect(getByText('Environment:Production')).toBeInTheDocument();
    expect(getAllByText('2').length).not.toBe(0);
    expect(getAllByText('tagType_predefined').length).not.toBe(0);
  });

  it('Should bulk select tags', async () => {
    const setSelectedTagsListMock = vi.fn();

    useGetIamTagsMock.mockReturnValue({
      tags: tagsList,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    const { container } = renderComponent({
      setSelectedTagsList: setSelectedTagsListMock,
    });

    const bulkCheckbox = await getOdsCheckbox({ container });

    fireEvent.click(bulkCheckbox);

    waitFor(() => {
      expect(setSelectedTagsListMock).toHaveBeenCalledWith(tagsList.list);
    });
  });

  it('Should display error', async () => {
    useGetIamTagsMock.mockReturnValue({
      tags: undefined,
      isLoading: false,
      error: {
        response: {
          data: {
            message: 'error',
          },
        },
      },
      isError: true,
    });

    renderComponent({});

    expect(addError).toHaveBeenCalledWith(
      '@ovh-ux/manager-common-translations/error:error_message',
    );
  });
});
