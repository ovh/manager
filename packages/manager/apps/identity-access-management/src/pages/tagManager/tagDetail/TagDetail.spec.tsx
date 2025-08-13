import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
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

const useParamsMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: useParamsMock,
}));

describe('Tag manager Tag Detail page', () => {
  it('display Tag detail page', async () => {
    const tag = 'environment:production';
    useParamsMock.mockImplementation(() => ({
      tag,
    }));

    await renderTestApp(urls.tagDetail);

    await assertTextVisibility(
      labels.tagManager.resourceTaggedWithTag.replace('{{tag}}', tag),
    );
  });
});
