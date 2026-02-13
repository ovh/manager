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
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import * as userAPI from '@/data/api/user/user.api';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import Rclone from './Rclone.modal';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { handleSelectComboboxText } from '@/__tests__/helpers/unitTestHelper';

const downloadMock = vi.fn();

vi.mock(
  '@/pages/object-storage/ObjectStorage.context',
  () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
    regions: [mockedRegion],
  })),
  }),
);

vi.mock('@/hooks/useLocale', () => ({
  useLocale: vi.fn(() => 'fr_FR'),
}));

vi.mock('@/hooks/useDownload.hook', () => ({
  default: vi.fn(() => ({
    download: downloadMock,
  })),
}));

vi.mock('@/data/api/user/user.api', () => ({
  getUserRclone: vi.fn(),
}));

vi.mock('@/components/region-with-flag/RegionWithFlag.component', () => ({
  default: ({ region }: { region?: { name?: string } }) => (
    <span>{region?.name ?? ''}</span>
  ),
}));

describe('Rclone', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      userId: String(mockedCloudUser.id),
    });
    downloadMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Rclone Modal', async () => {
    render(<Rclone />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('rclone-modal')).toBeTruthy();
    expect(screen.getByTestId('rclone-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(userAPI.getUserRclone).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<Rclone />, { wrapper: RouterWithQueryClientWrapper });
    await handleSelectComboboxText('select-region-trigger', 'BHS');

    act(() => {
      fireEvent.click(screen.getByTestId('rclone-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.getUserRclone).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userRcloneDownloadFailed',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<Rclone />, { wrapper: RouterWithQueryClientWrapper });

    await handleSelectComboboxText('select-region-trigger', 'BHS');
    act(() => {
      fireEvent.click(screen.getByTestId('rclone-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.getUserRclone).toHaveBeenCalled();
    });
  });
});
