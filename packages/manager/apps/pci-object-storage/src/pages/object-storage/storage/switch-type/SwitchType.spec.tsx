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
import * as swiftstorageAPI from '@/data/api/storage/swiftStorage.api';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { mockedSwiftContainer } from '@/__tests__/helpers/mocks/swift/swift';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import SwithType from './SwitchType.modal';

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

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
  editSwiftStorage: vi.fn((edit) => edit),
}));

describe('Switch Type Swift User', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', containerId: 'containerId' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Switch Type Swift', async () => {
    render(<SwithType />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('switch-type-modal')).toBeTruthy();
    expect(screen.getByTestId('switch-type-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(swiftstorageAPI.editSwiftStorage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<SwithType />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('switch-type-submit-button'));
    });
    await waitFor(() => {
      expect(swiftstorageAPI.editSwiftStorage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'The provided data is invalid',
        title: 'updateContainerToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<SwithType />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('switch-type-submit-button'));
    });
    await waitFor(() => {
      expect(swiftstorageAPI.editSwiftStorage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateContainerToastSuccessTitle',
        description: 'updateContainerToastSuccessDescription',
      });
    });
  });
});
