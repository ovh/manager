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
import * as datastoreApi from '@/data/api/ai//data/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import DeleteDatastore from './DeleteDatastore.modal';

describe('DeleteDatastore modal', () => {
  beforeEach(async () => {
    vi.mock('@/data/api/ai/data/datastore.api', () => ({
      deleteDatastore: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add datastore modal', async () => {
    render(<DeleteDatastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeTruthy();
    });
  });

  it('display error on delete datastore error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteDatastoreToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.deleteDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeleteDatastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete datastore success', async () => {
    render(<DeleteDatastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteDatastoreToastSuccessTitle',
        description: 'deleteDatastoreToastSuccessDescription',
      });
    });
  });
});
