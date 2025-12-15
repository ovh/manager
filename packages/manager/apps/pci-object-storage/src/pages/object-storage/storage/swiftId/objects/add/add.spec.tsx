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
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import * as storagesApi from '@/data/api/storage/storages.api';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import AddObjectModal from './Add.modal';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { mockedContainerAccess } from '@/__tests__/helpers/mocks/storageContainer/access';
import storages from '@/types/Storages';

// Create a mock swift with region matching the mockedContainerAccess
const mockedSwiftWithMatchingRegion: storages.ContainerDetail = {
  ...mockedContainerDetail,
  region: 'BHS', // Match the region in mockedContainerAccess
};

vi.mock('@/pages/object-storage/storage/swiftId/Swift.context', () => ({
  useSwiftData: vi.fn(() => ({
    projectId: 'projectId',
    swift: mockedSwiftWithMatchingRegion,
    swiftQuery: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorageAccess: vi.fn(),
}));

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  addSwiftObject: vi.fn(),
}));

describe('Add Object Modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'swiftId' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Add Object Modal', async () => {
    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-object-modal')).toBeTruthy();
      expect(screen.getByTestId('add-object-form-submit')).toBeTruthy();
      expect(screen.queryByTestId('file-upload-pending')).toBeFalsy();
    });
  });

  it('trigger onError on API Error during upload', async () => {
    vi.mocked(storagesApi.getStorageAccess).mockResolvedValue(
      mockedContainerAccess,
    );
    vi.mocked(swiftStorageApi.addSwiftObject).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(fileInput).toBeTruthy();
    });

    act(() => {
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-object-form-submit')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-form-submit'));
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
      expect(swiftStorageApi.addSwiftObject).toHaveBeenCalled();
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
    vi.mocked(swiftStorageApi.addSwiftObject).mockResolvedValue(mockResponse);

    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(fileInput).toBeTruthy();
    });

    act(() => {
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-object-form-submit')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-form-submit'));
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
      expect(swiftStorageApi.addSwiftObject).toHaveBeenCalledWith({
        url: expect.stringMatching(
          /myBHSurl\.com\/mocked-container\/test\.txt/,
        ),
        file,
        token: 'myToken',
      });
    });

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'addObjectToastSuccessDescription',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('..');
    });
  });
});
