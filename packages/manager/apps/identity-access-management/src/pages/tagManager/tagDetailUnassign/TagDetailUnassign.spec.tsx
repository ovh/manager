import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/test-utils/renderTestApp';
import { urls } from '@/routes/routes.constant';
import { labels } from '@/test-utils/labels';
import { iamResourcesListMock } from '@/mocks/iam-resource/iam-resource.mock';

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

const useParamMock = vi.hoisted(() => vi.fn());
const useLocationMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: useParamMock,
  useLocation: useLocationMock,
}));

describe('Tag Manager Tag Detail Unassign page', () => {
  it('display Tag Detail Unassign page', async () => {
    useParamMock.mockImplementation(() => ({
      tag: 'env:prod',
    }));

    useLocationMock.mockImplementation(() => ({
      state: {
        resources: iamResourcesListMock,
      },
      pathname:
        '/identity-access-management/tag-manager/env:prod/unassign-tags',
      search: '',
    }));

    await renderTestApp(urls.tagdetailUnassign);

    await assertTextVisibility(labels.tagManager.unassignTagModalTitle);
  });
});
