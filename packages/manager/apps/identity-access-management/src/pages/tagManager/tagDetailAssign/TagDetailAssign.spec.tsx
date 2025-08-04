import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
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

const useParamMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: useParamMock,
}));

describe('Tag Manager Tag Detail Assign page', () => {
  it('display Tag Detail Assign page', async () => {
    useParamMock.mockImplementation(() => ({
      tag: 'env:prod',
    }));

    await renderTestApp(urls.tagDetailAssign);

    await assertTextVisibility(
      labels.tagManager.assignTagToResources.replace('{{tag}}', 'env:prod'),
    );
  });
});
