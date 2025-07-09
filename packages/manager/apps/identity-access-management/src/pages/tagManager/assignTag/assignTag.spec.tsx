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

describe('Assign Tag Manager page', () => {
  it('display Assign Tag page', async () => {
    await renderTestApp(urls.assignTag);

    await assertTextVisibility(labels.tagManager.assignTags);
  });
});
