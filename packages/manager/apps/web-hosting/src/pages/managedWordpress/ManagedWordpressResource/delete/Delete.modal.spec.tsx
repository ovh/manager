import { useLocation, useParams } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { deleteManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import DeleteModal from './Delete.modal';

describe('Deletemodal Component', () => {
  it.skip('deletion for a website', async () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useLocation).mockReturnValue({
      state: { websiteIds: ['testID'] },
      pathname: '/delete',
      search: '',
      hash: '',
      key: '',
    });

    const { getByTestId } = render(<DeleteModal />);
    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteManagedCmsResourceWebsite).toHaveBeenCalledWith('test-service', 'testID');
    });
  });
});
