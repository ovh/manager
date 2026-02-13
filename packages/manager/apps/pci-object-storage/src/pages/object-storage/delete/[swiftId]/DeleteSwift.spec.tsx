import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as swiftStorageAPI from '@/data/api/storage/swiftStorage.api';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteSwiftModal from './DeleteSwift.modal';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import { mockedSwiftContainer } from '@/__tests__/helpers/mocks/swift/swift';

vi.mock(
  '@/pages/object-storage/ObjectStorage.context',
  () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
  }),
);

vi.mock('@/data/hooks/swift-storage/useGetSwift.hook', () => ({
  useGetSwift: vi.fn(() => ({
    data: mockedSwiftContainer,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  deleteSwiftStorage: vi.fn(),
}));

describe('Delete Swift', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'swiftId' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete Swift Modal', async () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('delete-storage-modal')).toBeTruthy();
    expect(screen.getByTestId('delete-storage-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(swiftStorageAPI.deleteSwiftStorage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-storage-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });
    await waitFor(() => {
      expect(swiftStorageAPI.deleteSwiftStorage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'The provided data is invalid',
        title: 'deleteStorageToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-storage-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });
    await waitFor(() => {
      expect(swiftStorageAPI.deleteSwiftStorage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteStorageToastSuccessTitle',
        description: 'deleteStorageToastSuccessDescription',
      });
    });
  });
});
