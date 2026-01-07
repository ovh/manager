import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Dashboard, { breadcrumb as Breadcrumb } from './Dashboard.page';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import {
  mocked3AZRegion,
  mockedLZRegion,
  mockedRegion,
} from '@/__tests__/helpers/mocks/region/region';

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [mockedStorageContainer],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
    regions: [mockedRegion, mocked3AZRegion, mockedLZRegion],
  })),
}));

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(),
}));

describe('Dashboard.page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('dashboardTab')).toBeTruthy();
    });
  });

  it('renders all cards when not localzone', () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('dashboardTitle')).toBeTruthy();
    expect(screen.getByTestId('bucket-container')).toBeTruthy();
    expect(screen.getByTestId('versionning-container')).toBeTruthy();
    expect(screen.getByTestId('object-lock-container')).toBeTruthy();
    expect(screen.getByTestId('encryption-container')).toBeTruthy();
    expect(screen.getByTestId('tags-container')).toBeTruthy();
    expect(screen.getByTestId('access-logs-card')).toBeTruthy();
    expect(screen.getByTestId('lifecycle-card')).toBeTruthy();
    expect(screen.getByTestId('static-website-hosting-card')).toBeTruthy();
  });

  it('call useNavigate on Activate encryption button', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('dashboardTitle')).toBeTruthy();
    expect(screen.getByTestId('encryption-container')).toBeTruthy();
    expect(screen.getByTestId('activate-encryption-button')).toBeTruthy();

    act(() => {
      fireEvent.click(screen.getByTestId('activate-encryption-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./active-encryption');
    });
  });

  it('call useNavigate on Activate versionning button', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('dashboardTitle')).toBeTruthy();
    expect(screen.getByTestId('versionning-container')).toBeTruthy();
    expect(screen.getByTestId('activate-versionning-button')).toBeTruthy();

    act(() => {
      fireEvent.click(screen.getByTestId('activate-versionning-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./active-versionning');
    });
  });
});
