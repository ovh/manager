import { describe, expect, it, vi } from 'vitest';
import { useParams, useSearchParams } from 'react-router-dom';
import DeleteModal from './Delete.modal';
import { fireEvent, render, act } from '@/utils/test.provider';
import { deleteManagedCmsResourceWebsite } from '@/data/api/managedWordpress';

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

    await act(() => {
      fireEvent.click(deleteButton);
    });
    expect(deleteManagedCmsResourceWebsite).toHaveBeenCalledOnce();
  });
});
