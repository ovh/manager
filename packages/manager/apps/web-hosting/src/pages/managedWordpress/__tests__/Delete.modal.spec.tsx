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
import { wrapper } from '@/utils/test.provider';

import DeleteModal from '../ManagedWordpressResource/delete/Delete.modal';

describe('DeleteModal Component', () => {
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
});
