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
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedSearchParams,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import * as storagesApi from '@/data/api/storage/storages.api';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import DeleteSwiftObject from './DeleteSwiftObject.modal';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { mockedContainerAccess } from '@/__tests__/helpers/mocks/storageContainer/access';
import storages from '@/types/Storages';
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';

// Create a mock swift with region matching the mockedContainerAccess
const mockedSwiftWithMatchingRegion: storages.ContainerDetail = {
  ...mockedContainerDetail,
  region: 'BHS', // Match the region in mockedContainerAccess
};

vi.mock(
  '@/pages/object-storage/swift/[swiftId]/Swift.context',
  () => ({
  useSwiftData: vi.fn(() => ({
    projectId: 'projectId',
    swift: mockedSwiftWithMatchingRegion,
    swiftQuery: { isLoading: false },
  })),
  }),
);

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorageAccess: vi.fn(),
}));

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  deleteSwiftObject: vi.fn(),
}));

describe('Delete Swift Object', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedSearchParams({ objectName: 'test-object.json' });
    setMockedUseParams({ projectId: 'projectId', swiftId: 'swiftId' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete Object Modal', async () => {
    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-object-modal')).toBeTruthy();
      expect(screen.getByTestId('delete-object-submit-button')).toBeTruthy();
      expect(screen.getByPlaceholderText('PERMANENTLY DELETE')).toBeTruthy();
    });
  });

  it('submit button is disabled if confirmation is incorrect', async () => {
    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      const submitButton = screen.getByTestId('delete-object-submit-button');
      expect(submitButton).toBeDisabled();
    });

    const input = screen.getByPlaceholderText('PERMANENTLY DELETE');

    act(() => {
      fireEvent.change(input, {
        target: { value: 'wrong confirmation' },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-object-submit-button')).toBeDisabled();
    });

    act(() => {
      fireEvent.change(input, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-object-submit-button'),
      ).not.toBeDisabled();
    });
  });

  it('navigates if objectName is not present', async () => {
    setMockedSearchParams({});

    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });

  it('trigger onError on getStorageAccess API Error', async () => {
    vi.mocked(storagesApi.getStorageAccess).mockRejectedValue(
      mockedObjStoError,
    );

    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByPlaceholderText('PERMANENTLY DELETE');

    act(() => {
      fireEvent.change(input, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-object-submit-button'),
      ).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-object-submit-button'));
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
      expect(swiftStorageApi.deleteSwiftObject).not.toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onError on deleteSwiftObject API Error', async () => {
    vi.mocked(storagesApi.getStorageAccess).mockResolvedValue(
      mockedContainerAccess,
    );
    vi.mocked(swiftStorageApi.deleteSwiftObject).mockRejectedValue(
      mockedObjStoError,
    );

    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByPlaceholderText('PERMANENTLY DELETE');

    act(() => {
      fireEvent.change(input, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-object-submit-button'),
      ).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-object-submit-button'));
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
    });

    await waitFor(() => {
      expect(swiftStorageApi.deleteSwiftObject).toHaveBeenCalledWith({
        objectName: 'test-object.json',
        storageName: mockedSwiftWithMatchingRegion.name,
        token: 'myToken',
        url: 'myBHSurl.com',
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    const mockResponse: Response = new Response(
      JSON.stringify({ message: 'ok' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );

    vi.mocked(storagesApi.getStorageAccess).mockResolvedValue(
      mockedContainerAccess,
    );
    vi.mocked(swiftStorageApi.deleteSwiftObject).mockResolvedValue(
      mockResponse,
    );

    render(<DeleteSwiftObject />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByPlaceholderText('PERMANENTLY DELETE');

    act(() => {
      fireEvent.change(input, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-object-submit-button'),
      ).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-object-submit-button'));
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
    });

    await waitFor(() => {
      expect(swiftStorageApi.deleteSwiftObject).toHaveBeenCalledWith({
        objectName: 'test-object.json',
        storageName: mockedSwiftWithMatchingRegion.name,
        token: 'myToken',
        url: 'myBHSurl.com',
      });
    });

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'deleteObjectToastSuccessDescription',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
});
