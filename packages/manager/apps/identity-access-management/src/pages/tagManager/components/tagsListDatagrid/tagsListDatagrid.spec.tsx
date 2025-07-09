import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import TagsListDatagrid from './tagsListDatagrid.component';
import { TagManagerContext } from '../../tagsManagerContext';
import tagsList from '../../../../mocks/iam-tags/getIamTags.json';

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
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TagManagerContext.Provider
        value={{
          toggleSystemCheck: vi.fn(),
          isShowSystemChecked: false,
          toggleUnassignedResources: vi.fn(),
          isShowUnassignedResourcesChecked: false,
        }}
      >
        <TagsListDatagrid />
      </TagManagerContext.Provider>
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
    const { getByText } = renderComponent();

    expect(getByText('common_pagination_no_results')).toBeInTheDocument();
  });

  it('Should display tags list', async () => {
    useGetIamTagsMock.mockReturnValue({
      tags: tagsList,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    const { getByText, getAllByText } = renderComponent();

    expect(getByText('Environment:Production')).toBeInTheDocument();
    expect(getAllByText('2').length).not.toBe(0);
    expect(getAllByText('predefined').length).not.toBe(0);
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

    renderComponent();

    expect(addError).toHaveBeenCalledWith(
      '@ovh-ux/manager-common-translations/error:error_message',
    );
  });
});
