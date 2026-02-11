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
import * as s3StorageAPI from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';
import BulkDeleteObjectsModal from './BulkDeleteObjects.modal';

const mockClearSelection = vi.fn();
const mockGetSelectedObjects = vi.fn();

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock(
  '@/pages/object-storage/storage/s3Id/objects/_contexts/ObjectSelection.context',
  () => ({
    useObjectSelection: vi.fn(() => ({
      getSelectedObjects: mockGetSelectedObjects,
      selectedCount: 2,
      clearSelection: mockClearSelection,
    })),
  }),
);

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  bulkDeleteS3Objects: vi.fn(),
}));

describe('Bulk Delete S3 Objects', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
    mockGetSelectedObjects.mockReturnValue([
      { key: 'object1.txt' },
      { key: 'object2.txt' },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Bulk Delete Objects Modal', async () => {
    render(<BulkDeleteObjectsModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('bulk-delete-objects-modal')).toBeTruthy();
    expect(screen.getByTestId('bulk-delete-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.bulkDeleteS3Objects).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<BulkDeleteObjectsModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('bulk-delete-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.bulkDeleteS3Objects).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<BulkDeleteObjectsModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('bulk-delete-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.bulkDeleteS3Objects).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'bulkDeleteToastSuccessDescription',
      });
      expect(mockClearSelection).toHaveBeenCalled();
    });
  });

  describe('when deleting versions', () => {
    beforeEach(() => {
      mockGetSelectedObjects.mockReturnValue([
        { key: 'object1.txt', versionId: 'v1' },
        { key: 'object2.txt', versionId: 'v2' },
      ]);
    });

    it('renders confirmation input for versions', async () => {
      render(<BulkDeleteObjectsModal />, {
        wrapper: RouterWithQueryClientWrapper,
      });
      expect(screen.getByTestId('bulk-delete-confirmation-input')).toBeTruthy();
    });

    it('trigger onError on API Error when deleting versions', async () => {
      vi.mocked(s3StorageAPI.bulkDeleteS3Objects).mockImplementation(() => {
        throw mockedObjStoError;
      });
      render(<BulkDeleteObjectsModal />, {
        wrapper: RouterWithQueryClientWrapper,
      });

      const confirmationInput = screen.getByTestId(
        'bulk-delete-confirmation-input',
      );
      act(() => {
        fireEvent.change(confirmationInput, {
          target: { value: PERMANENT_DELETE_CONFIRMATION },
        });
      });

      act(() => {
        fireEvent.click(screen.getByTestId('bulk-delete-submit-button'));
      });

      await waitFor(() => {
        expect(s3StorageAPI.bulkDeleteS3Objects).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastErrorTitle',
          description: getObjectStoreApiErrorMessage(mockedObjStoError),
          variant: 'critical',
        });
      });
    });

    it('trigger onSuccess when deleting versions', async () => {
      render(<BulkDeleteObjectsModal />, {
        wrapper: RouterWithQueryClientWrapper,
      });

      const confirmationInput = screen.getByTestId(
        'bulk-delete-confirmation-input',
      );
      act(() => {
        fireEvent.change(confirmationInput, {
          target: { value: PERMANENT_DELETE_CONFIRMATION },
        });
      });

      act(() => {
        fireEvent.click(screen.getByTestId('bulk-delete-submit-button'));
      });

      await waitFor(() => {
        expect(s3StorageAPI.bulkDeleteS3Objects).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastSuccessTitle',
          description: 'bulkDeleteToastSuccessDescription',
        });
        expect(mockClearSelection).toHaveBeenCalled();
      });
    });
  });
});
