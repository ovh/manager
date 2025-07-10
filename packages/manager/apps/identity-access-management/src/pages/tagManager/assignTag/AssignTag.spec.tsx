import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/test-utils/renderTestApp';
import { urls } from '@/routes/routes.constant';
import { labels } from '@/test-utils/labels';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => ({
  ...(await importOriginal()),
  useResourcesIcebergV2: vi.fn().mockReturnValue({
    flattenData: null,
    isError: false,
    error: {},
    totalCount: 0,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
    isLoading: true,
    status: {},
    sorting: [],
    setSorting: false,
    pageIndex: 1,
  }),
}));

const useLocationMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: useLocationMock,
}));

describe('Assign Tag Manager page', () => {
  it('display Assign Tag page', async () => {
    useLocationMock.mockImplementation(() => ({
      state: {
        tags: ['environment:production', 'test:test1'],
      },
      pathname: '/identity-access-management/tag-manager/assign-tags',
      search: '',
    }));

    await renderTestApp(urls.assignTag);

    await assertTextVisibility(labels.tagManager.assignMultipleToResources);
    expect((await screen.findAllByTestId('assigned-resource')).length).toBe(2);
  });
});
