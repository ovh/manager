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

vi.mock('@/data/hooks/useGetIamTags', () => ({
  useGetIamTags: useGetIamTagsMock,
}));

vi.mock('./tagTypeCell/tagTypeCell.component', () => ({
  default: (item: IamTagListItem) => <div>{item.type}</div>,
}));

vi.mock('./tagsListActions/tagsListActions.component', () => ({
  default: (item: IamTagListItem) => <div>{item.type}</div>,
}));

// vi.mock('../DatagridCells', () => ({
//   IpActionsCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpAlerts: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpAntiDdos: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpAttachedService: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpCountry: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpEdgeFirewall: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpGameFirewall: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpRegion: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpReverse: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpType: ({ ip }: { ip: string }) => <div>{ip}</div>,
//   IpVmac: ({ ip }: { ip: string }) => <div>{ip}</div>,
// }));

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
  it('Should display tag list', async () => {
    useGetIamTagsMock.mockReturnValue({
      tags: tagsList,
      isLoading: false,
      error: undefined,
      isError: undefined,
    });
    renderComponent();
  });
});
