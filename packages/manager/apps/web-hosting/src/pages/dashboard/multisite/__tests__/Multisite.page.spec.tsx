import React from 'react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks, WebHostingWebsiteMocks } from '@/data/__mocks__/websites';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test.provider';

import MultisitePage from '../Multisite.page';

vi.mock('@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite', () => ({
  useWebHostingWebsite: vi.fn().mockReturnValue({
    data: WebHostingWebsiteMocks,
    isLoading: false,
  }),
}));

vi.mock('@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain', () => ({
  useWebHostingWebsiteDomain: vi.fn().mockReturnValue({
    data: WebHostingWebsiteDomainMocks,
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

describe('MultisitePage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Datagrid and its topbar button', async () => {
    const { getByTestId } = render(<MultisitePage />);

    await waitFor(() => {
      expect(getByTestId('add-website-button')).toBeInTheDocument();
    });
    const button = getByTestId('add-website-button');
    expect(button).toHaveAttribute('label', commonTranslation.add_website);
  });
});
