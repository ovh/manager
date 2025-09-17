import { useParams, useSearchParams } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { deleteManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import DeleteModal from './Delete.modal';

describe('Deletemodal Component', () => {
  it('deletion for a website', async () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        websiteIds: 'testID',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<DeleteModal />);
    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteManagedCmsResourceWebsite).toHaveBeenCalled();
    });
  });
});
