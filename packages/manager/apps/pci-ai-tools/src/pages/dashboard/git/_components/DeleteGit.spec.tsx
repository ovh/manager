import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import DeleteGit from './DeleteGit.modal';

describe('DeleteGit modal', () => {
  beforeEach(async () => {
    vi.mock('@/data/api/ai/data/datastore.api', () => ({
      deleteDatastore: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close delete git modal', async () => {
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-git-modal')).not.toBeInTheDocument();
    });
  });

  it('display error on delete git error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteGitToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.deleteDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete git success', async () => {
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteGitToastSuccessTitle',
        description: 'deleteGitToastSuccessDescription',
      });
    });
  });
});
