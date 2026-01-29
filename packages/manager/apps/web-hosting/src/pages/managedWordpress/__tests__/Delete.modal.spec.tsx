import { useLocation, useParams } from 'react-router-dom';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import {
  deleteManagedCmsResourceWebsite,
  getManagedCmsResourceWebsites,
} from '@/data/api/managedWordpress';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import DeleteModal from '../ManagedWordpressResource/delete/Delete.modal';

describe('DeleteModal Component', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('deletion for a website', async () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useLocation).mockReturnValue({
      state: { websiteIds: ['testID'] },
      pathname: '/delete',
      search: '',
      hash: '',
      key: '',
    });

    vi.mocked(getManagedCmsResourceWebsites).mockResolvedValue({
      data: managedWordpressWebsitesMock,
      cursorNext: null,
      status: 200,
    } as IcebergFetchResultV2<ManagedWordpressWebsites>);

    const { getByTestId } = render(<DeleteModal />, { wrapper });
    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteManagedCmsResourceWebsite).toHaveBeenCalledWith('test-service', 'testID');
    });
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<DeleteModal />);
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
