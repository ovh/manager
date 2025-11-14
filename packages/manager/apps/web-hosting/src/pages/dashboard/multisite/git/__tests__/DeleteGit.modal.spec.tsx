import { useLocation } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { deleteGitAssociation } from '@/data/api/git';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import DeleteGitModal from '../DeleteGit.modal';

describe('DeleteGitModal', () => {
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('deletion for a website', async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { serviceName: 'test-service', path: 'test-path' },
      pathname: '/delete-git',
      search: '',
      hash: '',
      key: '',
    });

    vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => {
      return {
        useGetHostingServiceWebsite: vi.fn().mockReturnValue({
          data: ['1'],
        }),
      };
    });

    const { getByTestId } = render(<DeleteGitModal />);

    const deleteButton = getByTestId('primary-button');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteGitAssociation).toHaveBeenCalledWith('test-service', '1', false);
    });
  });
});
