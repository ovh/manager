// import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { renderTestApp } from '@/test-utils/renderTestApp';

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

describe('Tag Manager page', () => {
  it('displays Tag manager', async () => {
    await renderTestApp();
  });
});
