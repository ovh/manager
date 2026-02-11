import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedUsedNavigate,
  setMockedSearchParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Object from './Object.page';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedS3Object,
  mockedS3ObjectVersions,
} from '@/__tests__/helpers/mocks/s3/object';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Object: vi.fn(() => mockedS3Object),
  getS3ObjectVersions: vi.fn(() => mockedS3ObjectVersions),
}));

describe('Object.page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    setMockedSearchParams({ objectKey: 'objectKey' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders object info card and storage class card', async () => {
    render(<Object />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('object-info-card')).toBeTruthy();
      expect(screen.getByTestId('storage-class-card')).toBeTruthy();
    });

    expect(screen.getByText('objectInfoTitle')).toBeTruthy();
    expect(screen.getByText('tableHeaderSize')).toBeTruthy();
    expect(screen.getByText('tableHeaderUpdateDate')).toBeTruthy();
    expect(screen.getByText('tableHeaderStorageClass')).toBeTruthy();
  });

  it('call useNavigate on Change Storage Class button', async () => {
    render(<Object />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('change-storage-class-button')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('change-storage-class-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './change-storage-class?objectKey=objectKey',
      );
    });
  });
});
